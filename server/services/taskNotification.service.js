const { query } = require('../config/db');
const { sendEmail } = require('../utils/email');

async function sendTaskReminders() {
    // Get tasks due in next 24 hours
    const upcomingTasks = await query(`
        SELECT 
            t.*,
            u.email as user_email,
            u.username as user_name,
            l.name as lead_name,
            l.company as lead_company
        FROM tasks t
        JOIN users u ON u.id = t.assigned_to_id
        JOIN leads l ON l.id = t.lead_id
        WHERE t.status NOT IN ('COMPLETED', 'CANCELLED')
        AND t.due_date BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
        AND t.reminder_sent = false
    `);

    for (const task of upcomingTasks.rows) {
        await sendEmail({
            to: task.user_email,
            subject: `Task Reminder: ${task.title}`,
            template: 'task-reminder',
            context: {
                userName: task.user_name,
                taskTitle: task.title,
                taskDescription: task.description,
                dueDate: task.due_date,
                leadName: task.lead_name,
                leadCompany: task.lead_company,
                priority: task.priority
            }
        });

        // Mark reminder as sent
        await query(
            'UPDATE tasks SET reminder_sent = true WHERE id = $1',
            [task.id]
        );
    }
}