import { Form, Row } from 'antd';
import background from '../../img/2.jpg'
import './food.scss'
import Header from '../../components/header/header';
function Food() {
  return (
    <>
    <Header />

    <div>
      <div className="Food_Page">
        <div className='Food_background'>
          <img src={background} alt="" />
        </div>

        <div className='Food_title'>
          <h3>Food Calculator</h3>
        </div>
          <div className="Food_form">
            <Form>
              <Row>
                <Col></Col>
              </Row>
            </Form>
          </div>
      </div>
    </div>
    </>
  )
}

export default Food;