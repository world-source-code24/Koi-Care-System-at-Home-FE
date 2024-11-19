import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Function to decode Base64 string
const decodeBase64 = (encodedString) => {
  try {
    const decodedString = atob(encodedString); // Decode the Base64 string
    return decodedString;
  } catch (error) {
    console.error("Error decoding Base64:", error);
    return null;
  }
};

// Function to check if the timestamp is within 2 minutes
const isWithinTimeLimit = (timestamp) => {
  const currentTime = Date.now() / 1000; // Get current time in seconds (Unix timestamp)
  const timeDifference = currentTime - timestamp; // Difference in seconds
  return timeDifference <= 120; // 120 seconds = 2 minutes
};

const VerifyEmail = () => {
  const { email, timestamp } = useParams(); // Get the encoded email and timestamp from the URL path
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      // Decode the Base64 encoded email
      const decodedEmail = decodeBase64(email);

      if (!decodedEmail) {
        setMessage("Invalid verification link.");
        return;
      }

      const decodedTimestamp = parseInt(timestamp, 10); // Convert timestamp from URL to integer
      if (!isWithinTimeLimit(decodedTimestamp)) {
        setMessage("Verification link expired. Please request a new one.");
        return;
      }

      try {
        // Make the API call to verify the email
        const response = await axios.put(
          `https://koicaresystemapi.azurewebsites.net/api/User?email=${email}`
        );

        if (response.status === 200) {
          setMessage("Email verified successfully!");
          window.location.href = `https://koicareathome.azurewebsites.net/register?verification-success=true`;
        } else {
          setMessage("Verification failed. Invalid or expired link.");
        }
      } catch (error) {
        console.error(error);
        setMessage("An error occurred during verification.");
      }
    };

    verifyEmail();
  }, [email, timestamp]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;
