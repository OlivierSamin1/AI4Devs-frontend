import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Toast } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchPositionCandidates, fetchInterviewFlow, updateCandidateStage } from '../services/positionService';

// Component to render a candidate card
const CandidateCard = ({ candidate, onDragStart }) => {
  // Generate rating dots based on average score
  const renderRating = (score) => {
    // Only render the number of dots equal to the score (not fixed at 5)
    const dots = [];
    
    for (let i = 0; i < score; i++) {
      dots.push(
        <span 
          key={i} 
          className="rating-dot"
          style={{ backgroundColor: '#32CD32' }} // Bright green color like in the image
        />
      );
    }
    
    return <div className="mt-1">{dots}</div>;
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('candidateId', candidate.id);
    e.dataTransfer.setData('applicationId', candidate.applicationId);
    onDragStart(true);
  };

  const handleDragEnd = () => {
    onDragStart(false);
  };

  return (
    <Card 
      className="mb-3 shadow-sm candidate-card border-0"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Card.Body className="py-2">
        <div className="mb-1">{candidate.fullName}</div>
        {renderRating(candidate.averageScore)}
      </Card.Body>
    </Card>
  );
};

// Component to render an interview stage column
const InterviewColumn = ({ stage, candidates, interviewSteps, onDrop, isDragging }) => {
  // Get current stage name
  const stageName = stage.name;
  
  // Filter candidates that are in this stage by comparing the stage name
  const stagesCandidates = candidates.filter(
    candidate => candidate.currentInterviewStep === stageName
  );

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData('candidateId');
    const applicationId = e.dataTransfer.getData('applicationId');
    
    // Call the parent handler
    onDrop(Number(candidateId), Number(applicationId), stage.id);
  };

  return (
    <Col 
      className={`interview-column ${isDragging ? 'drop-target' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Card className="mb-4 shadow-sm h-100" style={{ backgroundColor: 'white' }}>
        <Card.Header className="text-center" style={{ backgroundColor: 'white' }}>
          <h5>{stageName}</h5>
        </Card.Header>
        <Card.Body>
          {stagesCandidates.length > 0 ? (
            stagesCandidates.map((candidate) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                onDragStart={(isDragging) => onDrop(null, null, null, isDragging)}
              />
            ))
          ) : (
            <p className="text-center text-muted">No candidates in this stage</p>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

const Position = () => {
  const { id } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [interviewFlow, setInterviewFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [candidatesData, interviewFlowData] = await Promise.all([
          fetchPositionCandidates(id),
          fetchInterviewFlow(id)
        ]);
        
        setCandidates(candidatesData);
        setInterviewFlow(interviewFlowData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load position data. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const handleCandidateDrop = async (candidateId, applicationId, newStageId, dragState) => {
    // If this is just a drag state update, handle it separately
    if (dragState !== undefined) {
      setIsDragging(dragState);
      return;
    }
    
    // If any parameter is null, just return (this happens during drag state updates)
    if (!candidateId || !applicationId || !newStageId) {
      return;
    }

    try {
      // Call the API to update the candidate's stage
      await updateCandidateStage(candidateId, applicationId, newStageId);
      
      // Update the local state to reflect the change
      setCandidates(prevCandidates => {
        return prevCandidates.map(candidate => {
          if (candidate.id === candidateId) {
            // Find the new stage name using the newStageId
            const newStage = interviewFlow.interviewFlow.interviewSteps.find(
              step => step.id === newStageId
            );
            
            return {
              ...candidate,
              currentInterviewStep: newStage ? newStage.name : candidate.currentInterviewStep
            };
          }
          return candidate;
        });
      });

      // Show success notification
      setNotification({
        show: true,
        message: 'Candidate moved successfully',
        type: 'success'
      });
    } catch (err) {
      console.error('Error moving candidate:', err);
      
      // Show error notification
      setNotification({
        show: true,
        message: 'Failed to move candidate. Please try again.',
        type: 'danger'
      });
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <h2>Loading...</h2>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5 text-center">
        <h2>Error</h2>
        <p>{error}</p>
      </Container>
    );
  }

  if (!interviewFlow) {
    return (
      <Container className="my-5 text-center">
        <h2>Position not found</h2>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#e9ecef', minHeight: '100vh', paddingTop: '20px', paddingBottom: '20px' }}>
      <Container className="my-5">
        <h2 className="text-center mb-4">{interviewFlow.positionName}</h2>
        
        <div className="interview-columns-container">
          <Row xs={1} md={interviewFlow.interviewFlow.interviewSteps.length} className="g-4">
            {interviewFlow.interviewFlow.interviewSteps
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((stage) => (
                <InterviewColumn 
                  key={stage.id} 
                  stage={stage} 
                  candidates={candidates}
                  interviewSteps={interviewFlow.interviewFlow.interviewSteps}
                  onDrop={handleCandidateDrop}
                  isDragging={isDragging}
                />
              ))
            }
          </Row>
        </div>

        {/* Notification Toast */}
        <Toast 
          show={notification.show}
          onClose={() => setNotification({ ...notification, show: false })} 
          delay={3000} 
          autohide
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            minWidth: '250px'
          }}
          bg={notification.type}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className={notification.type === 'danger' ? 'text-white' : ''}>
            {notification.message}
          </Toast.Body>
        </Toast>
      </Container>
    </div>
  );
};

export default Position; 