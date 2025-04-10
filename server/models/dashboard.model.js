const { query } = require('../config/db');

async function getDashboardStats() {
  const totalLeadsResult = await query('SELECT COUNT(*) FROM leads');
  const activeClientsResult = await query('SELECT COUNT(*) FROM clients');
  const wonLeadsResult = await query("SELECT COUNT(*) FROM leads WHERE status = 'Won'");

  const totalLeads = parseInt(totalLeadsResult.rows[0].count, 10);
  const activeClients = parseInt(activeClientsResult.rows[0].count, 10);
  const wonLeads = parseInt(wonLeadsResult.rows[0].count, 10);
  const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
  const dealsClosed = wonLeads * 15000; // Assuming $15K per deal

  const monthlySummary = [
    { month: 'Jan', newLeads: 50, converted: 20 },
    { month: 'Feb', newLeads: 60, converted: 25 },
    { month: 'Mar', newLeads: 55, converted: 22 },
    { month: 'Apr', newLeads: 70, converted: 30 },
    { month: 'May', newLeads: 65, converted: 28 },
    { month: 'Jun', newLeads: 80, converted: 35 },
  ];

  const salesFunnelResult = await query(
    "SELECT status, COUNT(*) as count FROM leads GROUP BY status"
  );
  const salesFunnel = salesFunnelResult.rows.map(row => ({
    stage: row.status,
    count: parseInt(row.count, 10),
  }));

  const topPerformersResult = await query(
    "SELECT u.id, u.username, u.email, COUNT(l.id) as deals_closed FROM users u LEFT JOIN leads l ON u.id = l.assigned_to_id AND l.status = 'Won' WHERE u.role = 'sales_rep' GROUP BY u.id, u.username, u.email"
  );
  const topPerformers = topPerformersResult.rows.map(user => ({
    userId: user.id,
    name: user.username,
    email: user.email,
    dealsClosed: parseInt(user.deals_closed, 10),
    amount: parseInt(user.deals_closed, 10) * 15000,
  })).sort((a, b) => b.amount - a.amount);

  return {
    totalLeads,
    activeClients,
    conversionRate,
    dealsClosed,
    monthlySummary,
    salesFunnel,
    topPerformers,
  };
}

module.exports = { getDashboardStats };