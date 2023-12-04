import React, {useCallback} from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const MapHeader = ({ location, setLocation, loading, onSearch }) => {
  const onChangeLocation = useCallback((e) => {
    setLocation({
      ...location,
      [e.target.name]: e.target.value
    })
  }, [location, setLocation]);

  return (
    <Row>
      <Form.Label column md={1}>
        Latitude
      </Form.Label>
      <Col md={3}>
        <Form.Control 
          type="number" 
          name="lat"
          value={location.lat}
          onChange={onChangeLocation}
        />
      </Col>

      <Form.Label column md={1}>
        Longitude
      </Form.Label>
      <Col md={3}>
        <Form.Control 
          type="number"
          name="lng" 
          value={location.lng}
          onChange={onChangeLocation}
        />
      </Col>

      <Col>
        <Button onClick={onSearch} disabled={loading}>{loading ? 'Searching...': 'Search'}</Button>
        </Col>
    </Row>
  );
};

export default MapHeader;
