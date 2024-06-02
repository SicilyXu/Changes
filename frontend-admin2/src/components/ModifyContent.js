import React, { useEffect, useContext, useState, useRef } from 'react';
import AppContext from '../context/AppContext';
import DetailIndex from '../components/DetailIndex.js';
import DetailContent from '../components/DetailContent.js';

function ModifyContent({ trace, setTrace }) {
  const [details, setDetails] = useState(null);
  const { hotelData, setHotelData } = useContext(AppContext);
  // 这里是一个点 一般set函数是不能放在dependicies里的,但是如果是context里面的react不能识别,
  // 用ref保证不触发useeffect hook告警
  const traceRef = useRef();
  const setHotelDataRef = useRef();
  traceRef.current = trace;
  setHotelDataRef.current = setHotelData;

  //正向传播 把hoteldata对应部分给details
  useEffect(() => {
    if (trace.length === 0) return;
    // console.log("content 正向");
    if (trace.length === 1) {
      if (hotelData.attributes.attributes && hotelData.attributes.attributes.length > trace[0]) {
        setDetails(hotelData.attributes.attributes[trace[0]])
      }
    } else if (trace.length === 2) {
      if (hotelData.attributes.attributes[trace[0]].attributes && hotelData.attributes.attributes[trace[0]].attributes.length > trace[1]) {
        setDetails(hotelData.attributes.attributes[trace[0]].attributes[trace[1]])
      }
    } else if (trace.length === 3) {
      if (hotelData.attributes.attributes[trace[0]].attributes[trace[1]].attributes.length > trace[2]) {
        setDetails(hotelData.attributes.attributes[trace[0]].attributes[trace[1]].attributes[trace[2]])
      }
    }
  }, [trace, hotelData]);

  useEffect(() => {
    if (details !== null && traceRef.current.length > 0) {
      // console.log("content 反向");
      setHotelDataRef.current(preData => {
        const newData = JSON.parse(JSON.stringify(preData));

        const trace = traceRef.current; // 使用 traceRef.current 获取最新的 trace 值

        if (trace.length === 1) {
          newData.attributes.attributes[trace[0]] = details;
        } else if (trace.length === 2) {
          if (!newData.attributes.attributes[trace[0]].attributes) {
            newData.attributes.attributes[trace[0]].attributes = [];
          }
          newData.attributes.attributes[trace[0]].attributes[trace[1]] = details;
        } else if (trace.length === 3) {
          const targetAttribute = newData.attributes.attributes[trace[0]].attributes[trace[1]];
          if (!targetAttribute.attributes) {
            targetAttribute.attributes = [];
          }
          targetAttribute.attributes[trace[2]] = details;
        }

        return newData;
      });
    }

  }, [details]);



  const handleback = () => {
    setTrace([]);
  }

  return (<>
    <button onClick={handleback} className='genenric-button' style={{paddingLeft:'0.33rem',paddingRight:'1rem'}}>&lt;&nbsp;&nbsp;Back</button>

    <div>
      {details && details.attributes ?
        <DetailIndex details={details} setDetails={setDetails} handleback={handleback}/> :
        <DetailContent details={details} setDetails={setDetails} handleback={handleback}/>}
    </div>
  </>)
}

export default ModifyContent;