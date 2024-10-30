import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import bg from "../../img/news.jpg";
import "./contact.scss";
import { Button, Form, Input, notification } from "antd"; // Sử dụng notification để hiển thị thông báo sau khi gửi
import axios from "axios"; // Thêm axios
import CarouselContact from "../../components/carouselContact/carouselContact";
import { useEffect } from "react";

function Contact() {
  const [form] = Form.useForm(); // Sử dụng form từ Ant Design để quản lý form

  const onFinish = async (values) => {
    const accId = localStorage.getItem("userId");
    try {
      const payload = {
        noteId: 1,
        noteName: values.Name,
        noteText: values.Message,
        accId: accId,
      };

      const response = await axios.post(
        `https://koicaresystemapi.azurewebsites.net/api/Note?accId=${accId}`,
        payload
      );
      console.log(response);
      if (response.status === 200) {
        notification.success({
          message: "Submission Successful",
          description: "Your message has been sent successfully!",
        });
        form.resetFields(); // Reset form sau khi gửi thành công
      } else {
        notification.error({
          message: "Submission Failed",
          description: "Something went wrong, please try again.",
        });
      }
    } catch (error) {
      console.error("Error sending data to API:", error);
      notification.error({
        message: "Submission Failed",
        description: "Unable to send message. Please try again later.",
      });
    }
  };

  return (
    <>
      <Header />
      <img src={bg} className="Contact__img" alt="" />
      <div className="ContactPage__tiltle">
        <br />
        <h3>The Royal Koi of system</h3>
        <p>Contact Royal Koi</p>
        <div className="divider"></div>
      </div>

      <div className="ContactPage">
        <div className="ContactPage__left">
          {/* Form xử lý dữ liệu khi submit */}
          <Form form={form} onFinish={onFinish}>
            <p>Name</p>
            <Form.Item
              name="Name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input className="input" />
            </Form.Item>

            <p>Message</p>
            <Form.Item
              name="Message"
              rules={[
                { required: true, message: "Please input your message!" },
              ]}
            >
              <Input.TextArea className="input" rows={5} />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
          <div className="divider"></div>
        </div>
        <div className="ContactPage__right">
          <div className="ContactPage__top">
            <h5>Contact Information</h5>
            <p className="p1">contact@gmail.com</p>
<p className="p2">+1 (555) 123 4567</p>
            <p className="p3">123 Example Street City, Country...</p>
          </div>
          <div className="ContactPage__bottom">
            <h5>Our Location</h5>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.163958945934!2d106.79814837485847!3d10.875131189279713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a6b19d6763%3A0x143c54525028b2e!2zTmjDoCBWxINuIGjDs2EgU2luaCB2acOqbiBUUC5IQ00!5e0!3m2!1svi!2s!4v1727801844992!5m2!1svi!2s"
              width="100%"
              height="350px"
              title="Location"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="ContactPage__popular">
        <h3>Some Koi popular</h3>
        <div className="divider"></div>
      </div>
      <div className="ContactPage__carousel">
        <CarouselContact numberOfSlide={4} autoplay={true} />
      </div>
      <Footer />
    </>
  );
}

export default Contact;