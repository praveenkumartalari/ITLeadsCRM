const { query } = require('../config/db');

async function getLeadAnalytics(leadId) {
    try {
        // Check if lead exists
        const leadExists = await query(
            'SELECT id FROM leads WHERE id = $1',
            [leadId]
        );

        if (!leadExists.rows.length) {
            throw new Error('Lead not found');
        }

        // Get interaction statistics with coalesce to handle nulls
        const interactionStats = await query(`
            SELECT 
                type,
                COUNT(*) as count,
                COALESCE(AVG(duration_minutes), 0) as avg_duration,
                MAX(interaction_date) as last_interaction,
                COUNT(CASE WHEN outcome IS NOT NULL THEN 1 END) as completed_interactions,
                COUNT(CASE WHEN next_follow_up IS NOT NULL THEN 1 END) as pending_followups
            FROM lead_interactions
            WHERE lead_id = $1
            GROUP BY type
        `, [leadId]);

        // Get response times with proper null handling
        const responseTimes = await query(`
            SELECT 
                COALESCE(
                    AVG(
                        CASE 
                            WHEN next_follow_up IS NOT NULL 
                            THEN EXTRACT(EPOCH FROM (created_at - next_follow_up))/3600 
                        END
                    ),
                    0
                ) as avg_response_time_hours,
                COUNT(*) as total_interactions,
                COUNT(CASE WHEN outcome IS NOT NULL THEN 1 END) as completed_interactions
            FROM lead_interactions
            WHERE lead_id = $1
        `, [leadId]);

        // Get task summary with proper counts
        const taskMetrics = await query(`
            SELECT 
                COUNT(*) as total_tasks,
                COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_tasks,
                COALESCE(
                    AVG(
                        CASE 
                            WHEN completed_at IS NOT NULL 
                            THEN EXTRACT(EPOCH FROM (completed_at - created_at))/3600 
                        END
                    ),
                    0
                ) as avg_completion_time_hours,
                COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_tasks
            FROM tasks
            WHERE lead_id = $1
        `, [leadId]);

        // Get latest interaction details
        const latestInteraction = await query(`
            SELECT 
                type,
                title,
                interaction_date,
                outcome
            FROM lead_interactions
            WHERE lead_id = $1
            ORDER BY interaction_date DESC
            LIMIT 1
        `, [leadId]);

        return {
            interactionStats: interactionStats.rows || [],
            responseTimes: {
                ...responseTimes.rows[0],
                avg_response_time_hours: Number(responseTimes.rows[0]?.avg_response_time_hours || 0).toFixed(2)
            },
            taskMetrics: {
                total_tasks: Number(taskMetrics.rows[0]?.total_tasks || 0),
                completed_tasks: Number(taskMetrics.rows[0]?.completed_tasks || 0),
                pending_tasks: Number(taskMetrics.rows[0]?.pending_tasks || 0),
                avg_completion_time_hours: Number(taskMetrics.rows[0]?.avg_completion_time_hours || 0).toFixed(2)
            },
            latestActivity: latestInteraction.rows[0] || null,
            summary: {
                totalInteractions: Number(responseTimes.rows[0]?.total_interactions || 0),
                completedInteractions: Number(responseTimes.rows[0]?.completed_interactions || 0),
                pendingFollowups: interactionStats.rows.reduce((acc, curr) => acc + Number(curr.pending_followups || 0), 0)
            }
        };
    } catch (error) {
        console.error('Error getting lead analytics:', error);
        throw error;
    }
}

module.exports = { getLeadAnalytics };