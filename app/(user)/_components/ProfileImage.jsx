"use client";

import { useState } from "react";
import Form from "react-bootstrap/Form";
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileImage = ({ imageSrc }) => {
  // store image source
  const [image, setImage] = useState(imageSrc);

  // on image change
  const onChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const data = new FormData();
      data.set('file', file);

      const response = await fetch('/api/update-profile-image', {
        method: 'POST',
        body: data
      });

      const res = await response.json();

      if (!response?.ok) throw new Error(res.msg);

      setImage(res?.image);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="">
        <img
          src={image}
          alt="User Profile"
          width={200}
          className="rounded-xl shadow-md mb-3"
        />

        <Form.Group controlId="profile">
          <Form.Control
            type="file"
            name="profileImage"
            accept=".png, .jpg, .jpeg, .ico"
            onChange={onChange}
          />
        </Form.Group>
      </div>
    </>
  );
};

export default ProfileImage;
