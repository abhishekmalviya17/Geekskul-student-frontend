import apiClient from "./apiClient.js";

/**
 * Fetch Fermion embed token for a live event session
 * @param {string} sessionId - Fermion liveEventSessionId
 * @param {string} userId - Current user ID
 * @returns {Promise<string>} - JWT token for embedding
 */
export async function getFermionEmbedToken(sessionId, userId) {
  if (!sessionId || !userId) {
    throw new Error("sessionId and userId are required");
  }

  try {
    const response = await apiClient.get("/fermion/embed-token", {
      params: {
        sessionId,
        userId,
      },
      withCredentials: true,
    });

    if (!response.data.token) {
      throw new Error("No token received from server");
    }

    return response.data.token;
  } catch (error) {
    console.error("Failed to fetch Fermion embed token:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch embed token"
    );
  }
}

/**
 * Get Fermion session status
 * @param {string} sessionId - Fermion session ID
 * @returns {Promise<Object>} - Session status information
 */
export async function getFermionSessionStatus(sessionId) {
  if (!sessionId) {
    throw new Error("sessionId is required");
  }

  try {
    const response = await apiClient.get("/fermion/session-status", {
      params: { sessionId },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch Fermion session status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch session status"
    );
  }
}

/**
 * Start a Fermion session (teacher only)
 * @param {string} lectureId - Lecture ID
 * @param {string} sessionId - Fermion session ID
 * @returns {Promise<Object>} - Updated session data
 */
export async function startFermionSession(lectureId, sessionId) {
  if (!lectureId || !sessionId) {
    throw new Error("lectureId and sessionId are required");
  }

  try {
    const response = await apiClient.post(
      "/fermion/start-session",
      {
        lectureId,
        sessionId,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to start Fermion session:", error);
    throw new Error(
      error.response?.data?.message || "Failed to start session"
    );
  }
}

/**
 * End a Fermion session (teacher only)
 * @param {string} lectureId - Lecture ID
 * @param {string} sessionId - Fermion session ID
 * @returns {Promise<Object>} - Updated session data
 */
export async function endFermionSession(lectureId, sessionId) {
  if (!lectureId || !sessionId) {
    throw new Error("lectureId and sessionId are required");
  }

  try {
    const response = await apiClient.post(
      "/fermion/end-session",
      {
        lectureId,
        sessionId,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to end Fermion session:", error);
    throw new Error(
      error.response?.data?.message || "Failed to end session"
    );
  }
}

/**
 * Create a new Fermion session (admin only)
 * @param {Object} params - Session parameters
 * @param {string} params.lectureId - Lecture ID
 * @param {string} params.eventTitle - Event title
 * @param {string} params.startTime - Start time (ISO 8601)
 * @param {string} params.endTime - End time (ISO 8601)
 * @returns {Promise<Object>} - Created session data
 */
export async function createFermionSessionManual(params) {
  const { lectureId, eventTitle, startTime, endTime } = params;

  if (!lectureId || !eventTitle || !startTime || !endTime) {
    throw new Error("lectureId, eventTitle, startTime, and endTime are required");
  }

  try {
    const response = await apiClient.post(
      "/fermion/create-session",
      {
        lectureId,
        eventTitle,
        startTime,
        endTime,
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to create Fermion session:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create session"
    );
  }
}

export default {
  getFermionEmbedToken,
  getFermionSessionStatus,
  startFermionSession,
  endFermionSession,
  createFermionSessionManual,
};
