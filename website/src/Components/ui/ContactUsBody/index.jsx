import React, { useEffect, useState } from "react";
import "./styles.css";
import Image from "../../../Components/base/image";
import contactUsImg from "../../../assets/images/contactUs.png";
import ReactDOMServer from "react-dom/server";
import location from "../../../assets/images/location1.png";
import phone from "../../../assets/images/phone1.png";
import email from "../../../assets/images/email1.png";
import Input from "../../base/input";
import MessageSentAlert from "../../base/messageSentAlert";
import axios from "axios";

const ContactUsBody = () => {
  const [isMessageSentAlertOpen, setIsMessageSentAlertOpen] = useState(false);
  const [inputValues, setInputValues] = useState({
    Name: "",
    Email: "",
    Subject: "",
    Message: "",
  });

  const closeMessageSentAlert = () => {
    setIsMessageSentAlertOpen(false);
  };

  const openMessageSentAlert = () => {
    setIsMessageSentAlertOpen(true);
  };

  //   const [choices] = useState(
  //     data.data[0].content
  //       .split("<op>")
  //       .map((choice) => choice.trim())
  //       .filter((choice) => choice !== "")
  //   );
  //   const [selectedOption, setSelectedOption] = useState("");

  //   const handleChange = (event) => {
  //     setSelectedOption(event.target.value);
  //     console.log("Selected option:", event.target.value);
  //   };

  // useEffect(() => {
  //   console.log(inputValues["Name"]);
  // }, [inputValues["Name"]]);

  // useEffect(() => {
  //   console.log(inputValues["Email"]);
  // }, [inputValues["Email"]]);

  // useEffect(() => {
  //   console.log(inputValues["Subject"]);
  // }, [inputValues["Subject"]]);

  // useEffect(() => {
  //   console.log(inputValues["Message"]);
  // }, [inputValues["Message"]]);

  const handleCloseAlert = () => {
    // setShowAlert(false);
  };

  const handleInputChange = (label, value) => {
    setInputValues((prevInputValues) => {
      const updatedInputValues = { ...prevInputValues, [label]: value };
      return updatedInputValues;
    });
  };

  const handleSendEmail = async () => {
    try {
      const dataForm = {
        name: inputValues["Name"],
        email: inputValues["Email"],
        subject: inputValues["Subject"],
        message: inputValues["Message"],
      };
      const response = await axios.post(
        "http://localhost:8000/api/sendMessage",
        dataForm
      );

      // console.log(response.status)
      // if (response.status === 200) {
      //   alert(response.data.message);
      // } else {
      //   alert('Failed to send the message.');
      // }
      if (response.status === 200) {
        // Show the success Alert
        // setShowAlert(true);

        openMessageSentAlert();
        // Clear the form fields
        setInputValues({
          Name: "",
          Email: "",
          Subject: "",
          Message: "",
        });

        // console.log(isMessageSentAlertOpen);
        console.log("response");
        console.log(response);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while sending the email.");
    }
  };

  return (
    <div className="flex column center">
      <div className="aboutContainer width-100 flex">
        <div className="aboutContainerLeft width-50 flex center">
          <div className="aboutContainerText flex">Contact Us</div>
        </div>

        <div className="aboutContainerRight width-50">
          <Image
            src={contactUsImg}
            alt="Contact Us for Port of Beirut"
            title="PORT OF BEIRUT"
            className="aboutPageImg flex center"
          />
        </div>
      </div>

      <div className="contactInfo flex">
        <div className="contactSection width-25 flex column align-items">
          <div className="contactImg">
            <Image src={location} className="contactInfoImg" />
          </div>

          <div className="contactText text-center">
            Quarantaine region
            <br />
            POBOX. 1490
            <br />
            Beirut - Lebanon
          </div>
        </div>
        <div className="contactSection width-25 flex column align-items">
          <div className="contactImg">
            <Image src={phone} className="contactInfoImg" />
          </div>

          <div className="contactText">TEL: +961 1 580211 till 16</div>
        </div>
        <div className="contactSection width-25 flex column align-items">
          <div className="contactImg">
            <Image src={phone} className="contactInfoImg" />
          </div>

          <div className="contactText">fax:+961 1 58 58 35</div>
        </div>
        <div className="contactSection width-25 flex column align-items">
          <div className="contactImg">
            <Image src={email} className="contactInfoImg" />
          </div>

          <div className="contactText">INFO@PORTDEBEYROUTH.COM</div>
        </div>
      </div>
      <div className="locateUs">
        <div className="locateUsbBtn pointer">
          <a
            href="https://www.google.com/maps/place/Port+of+Beirut/@33.9027573,35.5176967,17z/data=!3m1!4b1!4m6!3m5!1s0x151f16f00c4a3745:0x1dc57fdf4a7ae78f!8m2!3d33.9027573!4d35.5176967!16zL20vMDcyNmQ1?entry=ttu&g_ep=EgoyMDI1MDEyMi4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            Locate us
          </a>
        </div>
      </div>
      <div className="contactMessage width-100 flex justify-content">
        <div className="contactMessageContainer">
          <div className="contactMessageContent flex column ">
            <div className="messageTitle">Send us a message</div>

            <div className="messageInputs flex space-between ">
              <div className="messageInputName width-45 flex column">
                <div className="messageName">Name</div>
                <div className="messageInput">
                  <Input
                    type="text"
                    placeholder=""
                    value={inputValues["Name"]}
                    state={inputValues}
                    classProp="messageNameInput"
                    onChange={(newValue) => handleInputChange("Name", newValue)}
                    name="Name"
                  />
                </div>
              </div>
              <div className="messageInputName width-45 flex column">
                <div className="messageName">Email</div>
                <div className="messageInput">
                  <Input
                    type="text"
                    placeholder=""
                    value={inputValues["Email"]}
                    state={inputValues}
                    classProp="messageNameInput"
                    onChange={(newValue) =>
                      handleInputChange("Email", newValue)
                    }
                    name="Email"
                  />
                </div>
              </div>
            </div>
            <div className="messageInputs flex space-between">
              <div className="messageInputName width-45 flex column">
                <div className="messageName">Subject</div>
                <div className="messageInput">
                  <Input
                    type="text"
                    placeholder=""
                    value={inputValues["Subject"]}
                    state={inputValues}
                    classProp="messageNameInput"
                    onChange={(newValue) =>
                      handleInputChange("Subject", newValue)
                    }
                    name="Subject"
                  />
                </div>
              </div>
              <div className="messageInputName width-45 flex column">
                <div className="messageName">Message</div>
                <div className="messageInput">
                  <textarea
                    placeholder=""
                    value={inputValues["Message"]}
                    className="messageNameInput"
                    onChange={(e) =>
                      handleInputChange("Message", e.target.value)
                    }
                    name="Message"
                  />
                </div>
              </div>
            </div>

            <div className="sendEmail flex justify-content-end">
              <div className="sendEmailBtn pointer" onClick={handleSendEmail}>
                Send Email
              </div>
            </div>
          </div>
        </div>
      </div>

      <MessageSentAlert
        isOpen={isMessageSentAlertOpen}
        setIsOpen={setIsMessageSentAlertOpen}
        onClose={closeMessageSentAlert}
      />
    </div>
  );
};

export default ContactUsBody;