import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchPositionCandidates, fetchInterviewFlow } from '../services/positionService';

// Component to render a candidate card
const CandidateCard = ({ candidate }) => {
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

  return (
    <Card className="mb-3 shadow-sm candidate-card border-0">
      <Card.Body className="py-2">
        <div className="mb-1">{candidate.fullName}</div>
        {renderRating(candidate.averageScore)}
      </Card.Body>
    </Card>
  );
};

// Component to render an interview stage column
const InterviewColumn = ({ stage, candidates }) => {
  // Filter candidates that are in this stage
  const stagesCandidates = candidates.filter(
    candidate => candidate.currentInterviewStep === stage.name
  );

  return (
    <Col className="interview-column">
      <Card className="mb-4 shadow-sm h-100" style={{ backgroundColor: 'white' }}>
        <Card.Header className="text-center" style={{ backgroundColor: 'white' }}>
          <h5>{stage.name}</h5>
        </Card.Header>
        <Card.Body>
          {stagesCandidates.length > 0 ? (
            stagesCandidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
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
                />
              ))
            }
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Position; 