const { query } = require('../config/db');

const scoringRules = {
    // Demographic Scoring (20%)
    demographic: {
        companySize: {
            'Enterprise': 20,
            'Mid-Market': 15,
            'Small Business': 10,
            'Startup': 5
        },
        industry: {
            'Technology': 20,
            'Healthcare': 18,
            'Finance': 18,
            'Manufacturing': 15,
            'Retail': 12,
            'Other': 10
        },
        budget: {
            '>100000': 20,
            '50000-100000': 15,
            '10000-50000': 10,
            '<10000': 5
        }
    },
    // Engagement Scoring (40%)
    engagement: {
        interactions: {
            'MEETING': 15,
            'CALL': 10,
            'EMAIL': 5,
            'NOTE': 2,
            'OTHER': 1
        },
        responseTime: {
            'same_day': 10,
            'within_week': 5,
            'over_week': 0
        },
        frequency: {
            'high': 15,
            'medium': 10,
            'low': 5
        }
    },
    // Behavioral Scoring (40%)
    behavioral: {
        meetings_attended: 15,
        documents_viewed: 5,
        proposal_requested: 20,
        demo_scheduled: 15,
        quote_requested: 10
    }
};

async function calculateLeadScore(leadId) {
    try {
        // Get lead demographic data
        const leadData = await query(`
            SELECT 
                company_size,
                industry,
                budget,
                created_at
            FROM leads 
            WHERE id = $1
        `, [leadId]);

        if (!leadData.rows.length) {
            throw new Error('Lead not found');
        }

        const lead = leadData.rows[0];
        let totalScore = 0;

        // 1. Calculate Demographic Score (20%)
        let demographicScore = 0;
        demographicScore += scoringRules.demographic.companySize[lead.company_size] || 0;
        demographicScore += scoringRules.demographic.industry[lead.industry] || scoringRules.demographic.industry.Other;
        
        if (lead.budget) {
            if (lead.budget > 100000) demographicScore += scoringRules.demographic.budget['>100000'];
            else if (lead.budget > 50000) demographicScore += scoringRules.demographic.budget['50000-100000'];
            else if (lead.budget > 10000) demographicScore += scoringRules.demographic.budget['10000-50000'];
            else demographicScore += scoringRules.demographic.budget['<10000'];
        }

        // 2. Calculate Engagement Score (40%)
        const interactions = await query(`
            SELECT 
                type,
                created_at,
                outcome,
                EXTRACT(EPOCH FROM (created_at - lag(created_at) OVER (ORDER BY created_at))) as response_time_seconds
            FROM lead_interactions 
            WHERE lead_id = $1 
            ORDER BY created_at DESC
        `, [leadId]);

        let engagementScore = 0;
        let interactionCount = interactions.rows.length;

        interactions.rows.forEach(interaction => {
            // Interaction type score
            engagementScore += scoringRules.engagement.interactions[interaction.type] || 0;

            // Response time score
            if (interaction.response_time_seconds) {
                if (interaction.response_time_seconds <= 86400) { // Within 24 hours
                    engagementScore += scoringRules.engagement.responseTime.same_day;
                } else if (interaction.response_time_seconds <= 604800) { // Within a week
                    engagementScore += scoringRules.engagement.responseTime.within_week;
                }
            }
        });

        // Calculate frequency score
        const weeklyInteractionRate = interactionCount / 
            (Math.max(1, Math.ceil((Date.now() - new Date(lead.created_at).getTime()) / (7 * 24 * 60 * 60 * 1000))));

        if (weeklyInteractionRate > 3) {
            engagementScore += scoringRules.engagement.frequency.high;
        } else if (weeklyInteractionRate >= 1) {
            engagementScore += scoringRules.engagement.frequency.medium;
        } else {
            engagementScore += scoringRules.engagement.frequency.low;
        }

        // 3. Calculate Behavioral Score (40%)
        const behavior = await query(`
            SELECT 
                COUNT(CASE WHEN type = 'MEETING' AND outcome = 'ATTENDED' THEN 1 END) as meetings_attended,
                COUNT(CASE WHEN type = 'DOCUMENT' THEN 1 END) as documents_viewed,
                COUNT(CASE WHEN type = 'PROPOSAL' THEN 1 END) as proposals_requested,
                COUNT(CASE WHEN type = 'DEMO' THEN 1 END) as demos_scheduled,
                COUNT(CASE WHEN type = 'QUOTE' THEN 1 END) as quotes_requested
            FROM lead_interactions 
            WHERE lead_id = $1
        `, [leadId]);

        let behavioralScore = 0;
        const behaviorData = behavior.rows[0];

        if (behaviorData.meetings_attended > 0) {
            behavioralScore += scoringRules.behavioral.meetings_attended;
        }
        if (behaviorData.documents_viewed > 0) {
            behavioralScore += scoringRules.behavioral.documents_viewed;
        }
        if (behaviorData.proposals_requested > 0) {
            behavioralScore += scoringRules.behavioral.proposal_requested;
        }
        if (behaviorData.demos_scheduled > 0) {
            behavioralScore += scoringRules.behavioral.demo_scheduled;
        }
        if (behaviorData.quotes_requested > 0) {
            behavioralScore += scoringRules.behavioral.quote_requested;
        }

        // Calculate final score (normalize to 0-100)
        totalScore = Math.round(
            (demographicScore * 0.2) + 
            (engagementScore * 0.4) + 
            (behavioralScore * 0.4)
        );

        totalScore = Math.min(Math.max(totalScore, 0), 100);

        // Update lead score
        await query(`
            UPDATE leads 
            SET 
                score = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
        `, [totalScore, leadId]);

        return totalScore;
    } catch (error) {
        console.error('Error calculating lead score:', error);
        throw error;
    }
}

module.exports = { calculateLeadScore };