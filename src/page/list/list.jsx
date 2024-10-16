import Header from "../../components/header/header";
import "./list.scss";
import pic from "../../img/3.jpg";
import { Button, Divider, Input, Modal } from "antd";
import { Listkoi } from "../../share/listkoi";
function List() {
  return (
    <>
      <Header />
      <div className="List_page">
        <div className="List_background">
          <img src={pic} alt="" />
        </div>

        <div className="List_title">List of Koi</div>

        <div className="List_search">
          <Button type="sencondary">Search</Button>
          <Input placeholder="Search name of Koi fish" />
        </div>

        <div className="List_divider">
          <Divider />
        </div>

        <div className="row List-body">
          {filteredKoi.map((koi) => (
            <div className="col-md-2" key={koi.koiID}>
              <div className="koi-card">
                <img src={koi.Image} alt={koi.name} className="koi-image" />

                <Button type="secondary" onClick={() => showModal(koi)}>
                  {koi.name}
                </Button>
              </div>
            </div>
          ))}

          {notFound && (
            <div className="not-found-message">
              <h3>Oops, Your fish is not exist ! Please try again :((</h3>
            </div>
          )}
        </div>
        <div></div>
      </div>

      <Footer />
    </>
  );
}

export default List;
