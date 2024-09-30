
import Header from '../../components/header/header'
import './food.scss'
import koi from '../../img/background.jpg';
function FoodPage() {
  return (
    <div className='Foodpage'>
        <Header/>
        <div className='Food__img'>
            <img src={koi} alt="" />
        </div>
        <div className='Food_body'>
          <div></div>
          <div></div>
        </div>
    </div>
  )
}

export default FoodPage;