/**
 * Google Calendar MCP Service
 *
 * Demonstrates how MCP (Model Context Protocol) tools would be invoked
 * for Google Calendar operations. This service layer simulates MCP tool calls.
 *
 * In a real MCP implementation, these functions would call exposed MCP tools
 * from a Google Calendar MCP server.
 *
 * Example MCP tool names (when Google Calendar MCP server is connected):
 *   - google_calendar_create_event
 *   - google_calendar_update_event
 *   - google_calendar_delete_event
 *   - google_calendar_find_free_time
 *
 * Architecture:
 *   React Component → calendarMcpService → MCP Tool → Calendar MCP Server → Google Calendar API
 */

/**
 * Create an interview event in Google Calendar via MCP
 * @param {Object} opportunity - The opportunity with interview details
 * @returns {Promise<Object|null>} - Event ID and link, or null if not an interview
 *
 * MCP Tool Call (pseudo-code):
 *   callTool('google_calendar_create_event', {
 *     summary: 'Software Engineer Interview',
 *     description: 'Organization: Google\nLink: https://...\nStatus: Interview',
 *     startTime: '2025-06-15T14:00:00',
 *     endTime: '2025-06-15T15:00:00',
 *     reminders: [{ method: 'popup', minutes: 30 }]
 *   })
 */
export async function createInterviewEvent(opportunity) {
  if (opportunity.status !== 'Interview') {
    console.log('[MCP] Skipping calendar creation — not an interview');
    return null;
  }

  const eventPayload = buildEventPayload(opportunity);

  console.log('[MCP] → google_calendar_create_event', eventPayload);

  // Simulate MCP tool invocation delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In production, this would be:
  // const result = await mcpClient.callTool({
  //   name: 'google_calendar_create_event',
  //   arguments: eventPayload
  // });
  // return { calendarEventId: result.id, htmlLink: result.htmlLink };

  return {
    calendarEventId: `evt_sim_${Date.now()}`,
    htmlLink: 'https://calendar.google.com/calendar/event?eid=simulated',
  };
}

/**
 * Update an interview event in Google Calendar via MCP
 * @param {string} eventId - The Google Calendar event ID
 * @param {Object} opportunity - Updated opportunity data
 * @returns {Promise<Object|null>} - Updated event data
 *
 * MCP Tool Call (pseudo-code):
 *   callTool('google_calendar_update_event', {
 *     eventId: 'abc123',
 *     summary: 'Software Engineer Interview',
 *     description: '...',
 *     startTime: '2025-06-15T14:00:00',
 *     endTime: '2025-06-15T15:00:00'
 *   })
 */
export async function updateInterviewEvent(eventId, opportunity) {
  if (!eventId) {
    console.log('[MCP] Skipping calendar update — no event ID');
    return null;
  }

  const eventPayload = buildEventPayload(opportunity);

  console.log('[MCP] → google_calendar_update_event', {
    eventId,
    ...eventPayload,
  });

  await new Promise((resolve) => setTimeout(resolve, 300));

  // In production:
  // const result = await mcpClient.callTool({
  //   name: 'google_calendar_update_event',
  //   arguments: { eventId, ...eventPayload }
  // });
  // return result;

  return { updated: true };
}

/**
 * Delete an interview event from Google Calendar via MCP
 * @param {string} eventId - The Google Calendar event ID
 * @returns {Promise<void>}
 *
 * MCP Tool Call (pseudo-code):
 *   callTool('google_calendar_delete_event', {
 *     eventId: 'abc123'
 *   })
 */
export async function deleteInterviewEvent(eventId) {
  if (!eventId) {
    console.log('[MCP] Skipping calendar delete — no event ID');
    return;
  }

  console.log('[MCP] → google_calendar_delete_event', { eventId });

  await new Promise((resolve) => setTimeout(resolve, 300));

  // In production:
  // await mcpClient.callTool({
  //   name: 'google_calendar_delete_event',
  //   arguments: { eventId }
  // });
}

/**
 * Build event payload from opportunity
 */
function buildEventPayload(opportunity) {
  const { name, organization, link, interviewDate, interviewTime } = opportunity;
  const dateTime = `${interviewDate}T${interviewTime}:00`;

  // Calculate end time (default 1 hour)
  const [hours, minutes] = interviewTime.split(':').map(Number);
  const endHours = hours + 1;
  const endDateTime = `${interviewDate}T${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;

  return {
    summary: `${name} Interview`,
    description: `Organization: ${organization}\nLink: ${link}\nStatus: Interview`,
    start: {
      dateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    reminders: {
      useDefault: false,
      overrides: [{ method: 'popup', minutes: 30 }],
    },
  };
}