import axios from 'axios';

const API_URL = 'http://localhost:3010';

export const fetchPositionCandidates = async (positionId) => {
  try {
    const response = await axios.get(`${API_URL}/position/${positionId}/candidates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching position candidates:', error);
    throw error;
  }
};

export const fetchInterviewFlow = async (positionId) => {
  try {
    const response = await axios.get(`${API_URL}/position/${positionId}/interviewFlow`);
    return response.data.interviewFlow;
  } catch (error) {
    console.error('Error fetching interview flow:', error);
    throw error;
  }
};

export const updateCandidateStage = async (candidateId, applicationId, newStageId) => {
  try {
    const response = await axios.put(`${API_URL}/candidates/${candidateId}`, {
      applicationId: applicationId,
      currentInterviewStep: newStageId
    });
    return response.data;
  } catch (error) {
    console.error('Error updating candidate stage:', error);
    throw error;
  }
}; 