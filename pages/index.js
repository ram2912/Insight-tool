import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { send } from "emailjs-com";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [benchmarkInput, setbenchmarkInput] = useState("");
  const [result, setResult] = useState();
  const [LCVRInput, setLCVRInput] = useState("");
  const [LCVRbenchmarkInput, setLCVRbenchmarkInput] = useState("");
  const [WCVRInput, setWCVRInput] = useState("");
  const [toSend, setToSend] = useState({
    phone: "",
    email: "",
  });

  async function onSubmit(event) {
    event.preventDefault();
    try {
    const requestBody = {
        animal: animalInput,
        benchmark: benchmarkInput,
        LCVR: LCVRInput,
        LCVRbenchmark: LCVRbenchmarkInput,
        WCVR: WCVRInput
      };
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
setResult(data.result);
      //setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  const submitDetails = (close) => {
    //replace the below 3 params with your service_id, template_id, toSend remains the same, public_key
    send("service_g4z2qob", "template_k6g5zn4", toSend, "u-3qR4bR8hQYXoOaQ")
      .then((response) => {
        alert("Thanks for sending us your details!");
        console.log("SUCCESS!", response.status, response.text);
        close();
      })
      .catch((err) => {
        console.log("FAILED...", err);
      });
  };

  return (
    <div>
    <Head>
      <title>Agenda Generator</title>
      <link rel="icon" href="/dog.png" />
    </Head>
    <div className={styles.container}>
    <div className={styles.header}>
    <img src='/logo.svg' alt="Scorr Logo" width="100" height="60"></img>
    <h1 style={{ textAlign: "center" }}>Generate Agenda</h1>
    </div>
    <main className={styles.main}>
      <form onSubmit={onSubmit}>
        <tr>
          <td>Industry</td>
          <input
            type="text"
            name="animal"
            placeholder="SaaS, E-commerce, Manufacturing..."
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
            required
          />
        </tr>
        <tr>
          <td>Number of sales reps/AEs</td>
          <input
            type="text"
            name="benchmark1"
            placeholder="2,5,10..."
            value={benchmarkInput}
            onChange={(e) => setbenchmarkInput(e.target.value)}
            required
          />
        </tr>

        <tr>
          <td>ACV</td>
          <input
            type="text"
            name="conversion rate"
            placeholder="$2000, $500000, ..."
            value={LCVRInput}
            onChange={(e) => setLCVRInput(e.target.value)}
            required
          />
        </tr>
        <tr>
          <td>Sales cycle length (days)</td>
          <input
            type="text"
            name="LCVRbenchmark"
            placeholder="25, 30, 90, .."
            value={LCVRbenchmarkInput}
            onChange={(e) => setLCVRbenchmarkInput(e.target.value)}
            required
          />
        </tr>
        <tr>
          <td>Opportunity-to-win rate (%)</td>
          <input
            type="text"
            name="Win rate"
            placeholder="5, 10, ...."
            value={WCVRInput}
            onChange={(e) => setWCVRInput(e.target.value)}
            required
          />
        </tr>
        <Popup
          trigger={<button className={styles.submit} disabled={!animalInput || !benchmarkInput || !LCVRInput || !LCVRbenchmarkInput || !WCVRInput}> Generate results </button>}
          position="right center"
          modal
          nested
        >
          {(close) => (
            <div className={styles.popupClass}>
            <h1> Please Enter your details to view the result.</h1>
              <form>
                //<label for="number">Phone number</label>
                <br />
                <input
                  type="text"
                  name="phone"
                  value={toSend.phone}
                  onChange={handleChange}
                />
                <br />
                <label for="email">Email</label>
                <br />
                <input
                  type="text"
                  name="email"
                  value={toSend.email}
                  onChange={handleChange}
                />
                <br />
                <br />
                {/* <input type="submit" value="Submit"/> */}
              </form>
              <div>
                <button onClick={() => submitDetails(close)} className={styles.submit}>
                  Submit & close
                </button>
              </div>
            </div>
          )}
        </Popup>
        {/* <input type="submit" value="Generate results" /> */}
      </form>
      <div className={styles.result}>{result}</div>
    </main>
    </div>
    <br/><br/><br/>
    <p>Disclaimer: We care about your privacy and we do not save any of your sales data that you share with us.</p>
    <br/><br/>
    <footer className={styles.footer}>To know how we can automate this for your specific case, click here <a href="https://www.scorr.eu">scorr.eu</a> </footer>
  </div>
);
}

