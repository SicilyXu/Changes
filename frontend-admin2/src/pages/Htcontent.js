import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import ModifyIndex from '../components/ModifyIndex';
import ModifyContent from '../components/ModifyContent';


function Htcontent() {

  const [trace, setTrace] = useState([]);

  return (
    <>
      <div className='pb-3'>
        <Container style={{ backgroundColor: 'white' }} className='mt-3'>
          <ModifyIndex trace={trace} setTrace={setTrace} />
          {trace.length !== 0 &&
            <ModifyContent trace={trace} setTrace={setTrace} />

          }
        </Container>
      </div>
    </>
  )
}

export default Htcontent;