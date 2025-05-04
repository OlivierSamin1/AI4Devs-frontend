import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Toast } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchPositionCandidates, fetchInterviewFlow, updateCandidateStage } from '../services/positionService';

// Component to render a candidate card
const CandidateCard = ({ candidate, onDragStart, onTouchStart }) => {
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

  const handleTouchStart = (e) => {
    // Only prevent default if we're in a draggable context
    // This allows normal scrolling to still work when not dragging
    if (e.touches && e.touches.length === 1) {
      // Store touch position for potential drag
      onTouchStart(candidate);
    }
  };

  return (
    <Card 
      className="mb-3 shadow-sm candidate-card border-0"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
    >
      <Card.Body className="py-2">
        <div className="mb-1">{candidate.fullName}</div>
        {renderRating(candidate.averageScore)}
      </Card.Body>
    </Card>
  );
};

// Component to render an interview stage column
const InterviewColumn = ({ 
  stage, 
  candidates, 
  interviewSteps, 
  onDrop, 
  isDragging, 
  onColumnTouch,
  isActiveTouchTarget,
  columnIndex
}) => {
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
  
  // Handle touch on the column itself
  const handleTouchStart = () => {
    // Only trigger if we're already dragging a candidate
    onColumnTouch(columnIndex, stage.id);
  };

  return (
    <Col 
      className={`interview-column ${isDragging ? 'drop-target' : ''} ${isActiveTouchTarget ? 'touch-target' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onTouchStart={handleTouchStart}
      data-column-index={columnIndex}
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
                onTouchStart={(candidate) => onColumnTouch(columnIndex, stage.id, candidate)}
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
  
  // Mobile touch state
  const [activeTouchColumn, setActiveTouchColumn] = useState(null);
  const [touchDraggedCandidate, setTouchDraggedCandidate] = useState(null);
  const [touchTargetStageId, setTouchTargetStageId] = useState(null);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const containerRef = useRef(null);

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

  // Handle touch events for mobile drag and drop
  useEffect(() => {
    if (!containerRef.current) return;

    const handleTouchMove = (e) => {
      if (!touchDraggedCandidate) return;
      
      // Get all column elements
      const columns = document.querySelectorAll('.interview-column');
      
      // Find which column the touch is over
      const touch = e.touches[0];
      const touchX = touch.clientX;
      const touchY = touch.clientY;
      
      let targetColumn = null;
      
      columns.forEach((column, index) => {
        const rect = column.getBoundingClientRect();
        if (
          touchX >= rect.left && 
          touchX <= rect.right && 
          touchY >= rect.top && 
          touchY <= rect.bottom
        ) {
          targetColumn = index;
        }
      });
      
      if (targetColumn !== null && targetColumn !== activeTouchColumn) {
        const stageId = interviewFlow.interviewFlow.interviewSteps[targetColumn].id;
        setActiveTouchColumn(targetColumn);
        setTouchTargetStageId(stageId);
      }
    };
    
    const handleTouchEnd = () => {
      if (touchDraggedCandidate && touchTargetStageId && activeTouchColumn !== null) {
        // Confirm and execute the drop
        handleCandidateDrop(
          touchDraggedCandidate.id, 
          touchDraggedCandidate.applicationId, 
          touchTargetStageId
        );
      }
      
      // Reset touch state
      setTouchDraggedCandidate(null);
      setActiveTouchColumn(null);
      setTouchTargetStageId(null);
      setShowMobileControls(false);
    };
    
    // Use event options to specify passive: false to allow preventDefault calls
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchDraggedCandidate, activeTouchColumn, touchTargetStageId, interviewFlow]);

  const handleTouchColumnEnter = (columnIndex, stageId, candidate = null) => {
    if (candidate) {
      // A card was touched, start dragging
      setTouchDraggedCandidate(candidate);
      setShowMobileControls(true);
    }
    
    if (touchDraggedCandidate) {
      // Update the active column during drag
      setActiveTouchColumn(columnIndex);
      setTouchTargetStageId(stageId);
    }
  };

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
    <div 
      style={{ backgroundColor: '#e9ecef', minHeight: '100vh', paddingTop: '20px', paddingBottom: '20px' }}
      ref={containerRef}
    >
      <Container className="my-5 position-relative">
        <h2 className="text-center mb-4">{interviewFlow.positionName}</h2>
        
        {/* Mobile drag indicator */}
        {showMobileControls && touchDraggedCandidate && (
          <div className="mobile-drag-indicator">
            <p>Dragging: {touchDraggedCandidate.fullName}</p>
            <p>Move to a different column to change stage</p>
          </div>
        )}
        
        <div className="interview-columns-container">
          <Row xs={1} md={interviewFlow.interviewFlow.interviewSteps.length} className="g-4">
            {interviewFlow.interviewFlow.interviewSteps
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((stage, index) => (
                <InterviewColumn 
                  key={stage.id} 
                  stage={stage} 
                  candidates={candidates}
                  interviewSteps={interviewFlow.interviewFlow.interviewSteps}
                  onDrop={handleCandidateDrop}
                  isDragging={isDragging}
                  onColumnTouch={handleTouchColumnEnter}
                  isActiveTouchTarget={activeTouchColumn === index}
                  columnIndex={index}
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