import React, { useState } from 'react';
import { Row, Col, Button, InputGroup, FormControl, Form } from 'react-bootstrap';

const SpecialRangeLoader = () => {
    const [specialRanges, setSpecialRanges] = useState([]);
    const [newRange, setNewRange] = useState({ start_date: '', end_date: '', imagePreview: null, objectFit: 'cover', fileKey: Date.now() });
    const todayDate = new Date().toISOString().split('T')[0];
    const expectedWidth = 400;
    const expectedHeight = 100;

    // useEffect(() => {
    //     // 按 start_date 排序 specialRanges
    //         setSpecialRanges(specialRanges.slice().sort((a, b) => new Date(a.start_date) - new Date(b.start_date)));
    // }, [specialRanges]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageObjectURL = URL.createObjectURL(file);
            setNewRange({ ...newRange, imagePreview: imageObjectURL });
        }
    };

    const handleObjectFitChange = (e) => {
        setNewRange({ ...newRange, objectFit: e.target.value });
    };

    const handleAddSpecialRange = () => {
        if (newRange.start_date && newRange.end_date && newRange.imagePreview && isRangeValid(newRange)) {
            // 模拟图片上传API调用
            const mockUploadedImageUrl = newRange.imagePreview; // 实际应用中应替换为API返回的URL
            const newSpecialRange = {
                ...newRange,
                private_image_url: mockUploadedImageUrl,
                public_image_url: mockUploadedImageUrl
            };
            setSpecialRanges([...specialRanges, newSpecialRange].slice().sort((a, b) => new Date(a.start_date) - new Date(b.start_date)));
            setNewRange({ start_date: '', end_date: '', imagePreview: null, objectFit: 'none', fileKey: Date.now() }); // 重置 fileKey
        } else {
            alert("Invalid range, missing image, or invalid image. Please check your data.");
        }
    };


    const isRangeValid = (range) => {
        return !specialRanges.some(r =>
            (new Date(range.start_date) <= new Date(r.end_date) && new Date(range.end_date) >= new Date(r.start_date))
        );
    };

    const handleDeleteSpecialRange = (index) => {
        let updatedRanges = [...specialRanges];
        updatedRanges.splice(index, 1);
        updatedRanges = updatedRanges.slice().sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        setSpecialRanges(updatedRanges);
    };

    return (
        <div style={{ overflowX: 'hidden' }}>
            <Row className="mb-3">
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text style={{ width: '100px' }}>Start Date:</InputGroup.Text>
                        <FormControl
                            type="date"
                            min={todayDate}
                            value={newRange.start_date}
                            onChange={(e) => setNewRange({ ...newRange, start_date: e.target.value })}
                        />
                    </InputGroup>
                    <InputGroup className="mt-2">
                        <InputGroup.Text style={{ width: '100px' }}>End Date:</InputGroup.Text>
                        <FormControl
                            type="date"
                            min={newRange.start_date || todayDate}
                            value={newRange.end_date}
                            onChange={(e) => setNewRange({ ...newRange, end_date: e.target.value })}
                        />
                    </InputGroup>
                    {newRange.imagePreview && <InputGroup className="mt-2">
                        <InputGroup.Text style={{ width: '120px' }}>Display style:</InputGroup.Text>
                        <Form.Control as="select" value={newRange.objectFit} onChange={handleObjectFitChange}>
                            <option value="none">None</option>
                            <option value="fill">Fill</option>
                            <option value="cover">Cover</option>
                        </Form.Control>
                    </InputGroup>}
                </Col>
                <Col md={3}>
                    <input type="file" key={newRange.fileKey} onChange={handleImageChange} accept="image/*" />
                    {newRange.imagePreview && (
                        <div style={{ marginTop: '10px' }}>
                            <img src={newRange.imagePreview} alt="Preview" style={{ width: `${expectedWidth}px`, height: `${expectedHeight}px`, objectFit: newRange.objectFit }} />
                        </div>
                    )}
                </Col>
                <Col md={3}>
                    <Button onClick={handleAddSpecialRange}>Confirm</Button>
                </Col>
            </Row>

            <div className="special-range-list">
                {specialRanges.map((range, index) => (
                    <Row key={index} className="mb-2 align-items-center">
                        <Col md={4}>
                            <InputGroup>
                                <InputGroup.Text style={{ width: '100px' }}>Start Date:</InputGroup.Text>
                                <FormControl type="date" value={range.start_date} readOnly />
                            </InputGroup>
                            <InputGroup className="mt-2">
                                <InputGroup.Text style={{ width: '100px' }}>End Date:</InputGroup.Text>
                                <FormControl type="date" value={range.end_date} readOnly />
                            </InputGroup>
                        </Col>
                        <Col md={3}>
                            {range.imagePreview && (
                                <img src={range.imagePreview} alt="Preview" style={{ width: `${expectedWidth}px`, height: `${expectedHeight}px`, objectFit: range.objectFit }} />
                            )}
                        </Col>
                        <Col md={3}>
                            <Button variant="danger" onClick={() => handleDeleteSpecialRange(index)}>Delete</Button>
                        </Col>
                    </Row>
                ))}
            </div>
        </div>
    );
};

export default SpecialRangeLoader;