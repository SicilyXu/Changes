import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import { Row, Col, Button, Modal } from 'react-bootstrap';

function AttributeItem({ attribute, handleUp, handleDown, handleAdd, handleEdit, handleDelete, history }) {
  const calculateFontWeight = () => {
    if (history.length === 1)
      return 600
    else if (history.length === 2)
      return 500
    else if (history.length === 3)
      return 400
    return 400
  }
  return (
    <Row >
      <Row style={{ borderTop: '1px solid grey' }}>
        <Col lg={6} xs={9} style={{ paddingLeft: `${history.length}rem` }}>
          {/* <span>{attribute.name + attribute.global_id}</span> */}
          <span style={{ fontWeight: calculateFontWeight() }}>
            {attribute.name && attribute.name}
            <b style={{ color: 'red' }}>{!attribute.name && "Please Modify/Delete This Tab"}</b>
          </span>
        </Col>
        <Col lg={4} xs={3}>
          <i className="bi bi-arrow-up-square ps-1 pe-1" style={{ cursor: "pointer" }} onClick={() => handleUp(history)}></i>
          <i className="bi bi-arrow-down-square ps-1 pe-1" style={{ cursor: "pointer" }} onClick={() => handleDown(history)}></i>
          <i className="bi bi-pencil-square ps-1 pe-1" style={{ cursor: "pointer" }} onClick={() => handleEdit(history)}></i>
          {attribute.global_id.substring(6, 8) === "00" && attribute.attributes_inner && attribute.attributes_inner === "overlay" &&
            <i className="bi bi-plus-square ps-1 pe-1" style={{ cursor: "pointer" }} onClick={() => handleAdd(history, "overlay")}></i>}
          {attribute.global_id.substring(6, 8) === "00" && attribute.attributes_inner && attribute.attributes_inner === "sidebar" &&
            <i className="bi bi-plus-square-dotted ps-1 pe-1" style={{ cursor: "pointer" }} onClick={() => handleAdd(history, "sidebar")}></i>}
          <i className="bi bi-x-square ps-1 pe-1" style={{ cursor: "pointer" }} onClick={() => handleDelete(history)}></i>
        </Col>
      </Row>

      {attribute && attribute.attributes && attribute.attributes.length > 0 && attribute.attributes.map((childAttribute, index) => {
        return (
          <AttributeItem key={childAttribute.global_id + childAttribute.name} attribute={childAttribute}
            handleUp={handleUp} handleDown={handleDown} handleAdd={handleAdd}
            handleEdit={handleEdit} handleDelete={handleDelete} history={[...history, index]} />)
      })}
    </Row>
  );
}


function ModifyIndex({ trace, setTrace }) {
  const [details, setDetails] = useState(null);
  const { hotelData, setHotelData, uploadHotel } = useContext(AppContext);
  const [needupdate, setNeedUpdate] = useState(false);

  // state only for modals
  const [show, setShow] = useState(false);
  const handleClose = () => { setShow(false); }
  const handleShow = () => { setShow(true); }
  const handleListChoice = () => {
    handleClose();
    const tempDetails = [...details];
    tempDetails[tempDetails.length - 1].attributes_inner = "overlay";
    setDetails(tempDetails);
  };
  const handleEntryChoice = () => {
    handleClose();
    const tempDetails = [...details];
    tempDetails[tempDetails.length - 1].attributes_inner = "sidebar";
    setDetails(tempDetails);
  };


  const initialIndex = {
    global_id: "",
    name: "",
    attributes_inner: "",//sidebar or overlay
    private_image_url: "",
    public_image_url: "",
    attributes: [],
  }

  const initialcontent = {
    global_id: "",
    name: "",
    left_description: "",
    right_description: "",
    private_brand_url: "",
    public_brand_url: "",
    private_image_urls: [],
    public_iamge_urls: [],
    QR: {},
    custom_actions: ""
  }

  //正向更新
  useEffect(() => {
    // console.log("index 正向");
    if (hotelData) {
      setDetails(hotelData.attributes.attributes);
    }
  }, [hotelData]);
  //const details = useMemo(() => hotelData.attributes.attributes, [hotelData]);
  //其实用这个更好

  //反向更新
  useEffect(() => {
    if (details !== null && needupdate) {
      // console.log("index 反向");
      setNeedUpdate(false);
      setHotelData((preData) => ({
        ...preData,
        attributes: {
          ...preData.attributes,
          attributes: details
        }
      }))
    }

  }, [details, setHotelData, needupdate])


  const modifyGolbalId = (tempDetails, tempGlobalId) => {
    if (tempGlobalId.substring(4, 8) === "0000") {
      if (tempDetails.attributes) {
        tempDetails.attributes.map(tempDetail => {
          tempDetail.global_id = tempGlobalId.substring(0, 4) + tempDetail.global_id.substring(4, 8);
          if (tempDetail.attributes) {
            modifyGolbalId(tempDetail.attributes, tempGlobalId)
          }
          return tempDetail
        })
      }
    } else if (tempGlobalId.substring(6, 8) === "00") {
      if (tempDetails.attributes) {
        tempDetails.attributes.map(tempDetail => {
          tempDetail.global_id = tempGlobalId.substring(0, 6) + tempDetail.global_id.substring(6, 8);
          return tempDetail
        })
      }
    } else {
      return tempDetails
    }
    return tempDetails
  }

  const handleUp = (history) => {
    const tempDetails = [...details]; // deep copy!!!
    if (history[history.length - 1] > 0) {
      let tempDetailsCurr, tempDetailsPrev
      if (history.length === 1) {
        const index1 = history[0]
        // store data,pre_data, global_id, pre_global_id
        tempDetailsCurr = tempDetails[index1];
        tempDetailsPrev = tempDetails[index1 - 1];
        const tempGlobalId = tempDetailsCurr.global_id;
        const tempGlobalIdPrev = tempDetailsPrev.global_id;

        tempDetails[index1] = tempDetailsPrev;
        tempDetails[index1 - 1] = tempDetailsCurr;

        tempDetailsCurr.global_id = tempGlobalIdPrev;
        tempDetailsPrev.global_id = tempGlobalId;
        modifyGolbalId(tempDetailsCurr, tempGlobalIdPrev);
        modifyGolbalId(tempDetailsPrev, tempGlobalId);

        setDetails(tempDetails)
      } else if (history.length === 2) {
        const index1 = history[0];
        const index2 = history[1];

        tempDetailsCurr = tempDetails[index1].attributes[index2];
        tempDetailsPrev = tempDetails[index1].attributes[index2 - 1];
        const tempGlobalId = tempDetailsCurr.global_id;
        const tempGlobalIdPrev = tempDetailsPrev.global_id;
        tempDetails[index1].attributes[index2] = tempDetailsPrev;
        tempDetails[index1].attributes[index2 - 1] = tempDetailsCurr;

        tempDetailsCurr.global_id = tempGlobalIdPrev;
        tempDetailsPrev.global_id = tempGlobalId;
        modifyGolbalId(tempDetailsCurr, tempGlobalIdPrev);
        modifyGolbalId(tempDetailsPrev, tempGlobalId);
        setDetails(tempDetails)
      }
      else if (history.length === 3) {
        const index1 = history[0];
        const index2 = history[1];
        const index3 = history[2];

        tempDetailsCurr = tempDetails[index1].attributes[index2].attributes[index3];
        tempDetailsPrev = tempDetails[index1].attributes[index2].attributes[index3 - 1];
        const tempGlobalId = tempDetailsCurr.global_id;
        const tempGlobalIdPrev = tempDetailsPrev.global_id;
        tempDetails[index1].attributes[index2].attributes[index3] = tempDetailsPrev;
        tempDetails[index1].attributes[index2].attributes[index3 - 1] = tempDetailsCurr;

        tempDetailsCurr.global_id = tempGlobalIdPrev;
        tempDetailsPrev.global_id = tempGlobalId;
        modifyGolbalId(tempDetailsCurr, tempGlobalIdPrev);
        modifyGolbalId(tempDetailsPrev, tempGlobalId);
        setDetails(tempDetails)
      }
      setNeedUpdate(true);
    }
  }

  const handleDown = (history) => {
    const tempDetails = [...details]; // deep copy!!!
    // more logic to check if can go down
    let maxOffset
    if (history.length === 1) maxOffset = tempDetails.length;
    else if (history.length === 2) maxOffset = tempDetails[history[0]].attributes.length;
    else if (history.length === 3) maxOffset = tempDetails[history[0]].attributes[history[1]].attributes.length;

    if (history[history.length - 1] < maxOffset - 1) {
      let tempDetailsCurr, tempDetailsPrev
      if (history.length === 1) {
        const index1 = history[0]
        // store data,pre_data, global_id, pre_global_id
        tempDetailsCurr = tempDetails[index1];
        tempDetailsPrev = tempDetails[index1 + 1];
        const tempGlobalId = tempDetailsCurr.global_id;
        const tempGlobalIdPrev = tempDetailsPrev.global_id;

        tempDetails[index1] = tempDetailsPrev;
        tempDetails[index1 + 1] = tempDetailsCurr;

        tempDetailsCurr.global_id = tempGlobalIdPrev;
        tempDetailsPrev.global_id = tempGlobalId;
        modifyGolbalId(tempDetailsCurr, tempGlobalIdPrev);
        modifyGolbalId(tempDetailsPrev, tempGlobalId);

        setDetails(tempDetails)
      } else if (history.length === 2) {
        const index1 = history[0];
        const index2 = history[1];

        tempDetailsCurr = tempDetails[index1].attributes[index2];
        tempDetailsPrev = tempDetails[index1].attributes[index2 + 1];
        const tempGlobalId = tempDetailsCurr.global_id;
        const tempGlobalIdPrev = tempDetailsPrev.global_id;
        tempDetails[index1].attributes[index2] = tempDetailsPrev;
        tempDetails[index1].attributes[index2 + 1] = tempDetailsCurr;

        tempDetailsCurr.global_id = tempGlobalIdPrev;
        tempDetailsPrev.global_id = tempGlobalId;
        modifyGolbalId(tempDetailsCurr, tempGlobalIdPrev);
        modifyGolbalId(tempDetailsPrev, tempGlobalId);
        setDetails(tempDetails)
      }
      else if (history.length === 3) {
        const index1 = history[0];
        const index2 = history[1];
        const index3 = history[2];

        tempDetailsCurr = tempDetails[index1].attributes[index2].attributes[index3];
        tempDetailsPrev = tempDetails[index1].attributes[index2].attributes[index3 + 1];
        const tempGlobalId = tempDetailsCurr.global_id;
        const tempGlobalIdPrev = tempDetailsPrev.global_id;
        tempDetails[index1].attributes[index2].attributes[index3] = tempDetailsPrev;
        tempDetails[index1].attributes[index2].attributes[index3 + 1] = tempDetailsCurr;

        tempDetailsCurr.global_id = tempGlobalIdPrev;
        tempDetailsPrev.global_id = tempGlobalId;
        modifyGolbalId(tempDetailsCurr, tempGlobalIdPrev);
        modifyGolbalId(tempDetailsPrev, tempGlobalId);
        setDetails(tempDetails)
      }
      setNeedUpdate(true);
    }
  }

  const handleAdd = (history, addType) => { // addType should be sidebar or overlay
    console.log("Add", history);
    const traceHistory = [...history];
    const tempDetails = [...details];
    if (addType === "sidebar") {
      if (history.length === 2) {
        const tempInitialContent = JSON.parse(JSON.stringify(initialcontent));
        let preGlobalId;
        if (tempDetails[history[0]].attributes[history[1]].attributes.length > 0)
          preGlobalId = tempDetails[history[0]].attributes[history[1]].attributes[tempDetails[history[0]].attributes[history[1]].attributes.length - 1].global_id
        else
          preGlobalId = tempDetails[history[0]].attributes[history[1]].global_id.substring(0, 6) + "00";
        tempInitialContent.global_id = preGlobalId.substring(0, 6) + (parseInt(preGlobalId.substring(6, 8)) < 9 ? "0" : "") + (parseInt(preGlobalId.substring(6, 8)) + 1).toString();
        tempDetails[history[0]].attributes[history[1]].attributes.push(tempInitialContent);
        traceHistory.push(parseInt(preGlobalId.substring(6, 8)));
      } else if (history.length === 1) {
        const tempInitialContent = JSON.parse(JSON.stringify(initialcontent));
        let preGlobalId
        if (tempDetails[history[0]].attributes.length > 0)
          preGlobalId = tempDetails[history[0]].attributes[tempDetails[history[0]].attributes.length - 1].global_id;
        else
          preGlobalId = tempDetails[history[0]].global_id.substring(0, 4) + "0000"
        tempInitialContent.global_id = preGlobalId.substring(0, 6) + (parseInt(preGlobalId.substring(6, 8)) < 9 ? "0" : "") + (parseInt(preGlobalId.substring(6, 8)) + 1).toString();
        tempDetails[history[0]].attributes.push(tempInitialContent);
        traceHistory.push(parseInt(preGlobalId.substring(6, 8)));
      }
    } else if (addType === "overlay") {
      if (history.length === 1) {
        const tempInitialIndex = JSON.parse(JSON.stringify(initialIndex));
        let preGlobalId
        if (tempDetails[history[0]].attributes.length > 0)
          preGlobalId = tempDetails[history[0]].attributes[tempDetails[history[0]].attributes.length - 1].global_id;
        else
          preGlobalId = tempDetails[history[0]].global_id.substring(0, 4) + "0001"
        tempInitialIndex.global_id = preGlobalId.substring(0, 4) + (parseInt(preGlobalId.substring(4, 6)) < 9 ? "0" : "") + (parseInt(preGlobalId.substring(4, 6)) + 1) + "00"
        tempInitialIndex.attributes_inner = "sidebar"; // has to be sidebar
        tempDetails[history[0]].attributes.push(tempInitialIndex);
        traceHistory.push(parseInt(preGlobalId.substring(4, 6)));
      } else if (history.length === 0) {
        handleShow();
        const tempInitialIndex = JSON.parse(JSON.stringify(initialIndex));
        let preGlobalId
        if (tempDetails.length > 0)
          preGlobalId = tempDetails[tempDetails.length - 1].global_id;
        else
          preGlobalId = tempDetails[history[0]].global_id.substring(0, 2) + "010000"
        tempInitialIndex.global_id = preGlobalId.substring(0, 2) + (parseInt(preGlobalId.substring(2, 4)) < 9 ? "0" : "") + (parseInt(preGlobalId.substring(2, 4)) + 1) + "0000"
        tempDetails.push(tempInitialIndex);
        traceHistory.push(parseInt(preGlobalId.substring(2, 4)));
        // console.log(history, preGlobalId, tempInitialIndex);
        // console.log(tempDetails);
      }
    }
    console.log('trace', traceHistory);
    setTrace(traceHistory);
    setDetails(tempDetails);
    setNeedUpdate(true);
  }

  const handleEdit = (history) => {
    setTrace(history);
  }

  const handleDelete = (history) => {
    // TO DO but will not incudle in this iter
    // when delete a tab, the below ids will not modify corresponding
    // 这个地方有问题可能存在潜在bug 就是删除一个id之后后面的部分没有随着这个删除而变动
    const tempDetails = [...details]; // deep copy!!!
    let tempModifyDetails;
    if (history.length === 1) {
      tempModifyDetails = tempDetails;
    }
    else if (history.length === 2) {
      tempModifyDetails = tempDetails[history[0]].attributes
    }
    else if (history.length === 3) {
      tempModifyDetails = tempDetails[history[0]].attributes[history[1]].attributes
    }
    // console.log(tempDetails);
    tempModifyDetails.splice(history[history.length - 1], 1)
    // console.log("Delete", history);
    setDetails(tempDetails);
    setNeedUpdate(true);
  }

  return (
    <Row className="" >
      {trace.length === 0 && <> <Row style={{ border: '1px solid rgb(160,160,160)' }}>
        <Row style={{ backgroundColor: 'rgb(224,224,224)' }} >
          <Col lg={6} xs={9} className='p-1'>Title</Col>
          <Col lg={4} xs={3} className='p-1'>Actions</Col>
        </Row>
        <Row className='p-1'>
          <Row style={{ fontWeight: '600' }}>
            <Col lg={6} xs={9}>Hotel Home</Col>
            <Col lg={4} xs={3} ><i className="bi bi-plus-square ps-1 pe-1" style={{ cursor: "pointer" }} onClick={() => handleAdd([], "overlay")}></i></Col>
          </Row>

          {details && <Row>
            {details.map((attribute, index) => (
              <AttributeItem key={attribute.global_id} attribute={attribute}
                handleUp={handleUp} handleDown={handleDown} handleAdd={handleAdd}
                handleEdit={handleEdit} handleDelete={handleDelete} history={[index]} />
            ))}
          </Row>}



        </Row>
      </Row>
        <Row>

          <Col style={{ direction: "rtl" }} className='mt-3 mb-3'>
            <button onClick={() => { uploadHotel() }} className='genenric-button'>Save & Update</button>
          </Col>

        </Row>
      </>
      }
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>What is inside?</Modal.Title>
        </Modal.Header>
        <Modal.Body>For the attributes inner this tab, do you want directory list (still index) or directory entry (content) inside?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleListChoice}>
            Directory List
          </Button>
          <Button variant="primary" onClick={handleEntryChoice}>
            Directory Entry
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  )
}

export default ModifyIndex;