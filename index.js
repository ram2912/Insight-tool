import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [benchmarkInput, setbenchmarkInput] = useState("");
  const [result, setResult] = useState();
  const [LCVRInput, setLCVRInput] = useState("");
  const [LCVRbenchmarkInput, setLCVRbenchmarkInput] = useState("");
  const [WCVRInput, setWCVRInput] = useState("");

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

  return (
    <div>
      <Head>
        <title>1:1 agenda generator</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
    <h3 style={{textAlign: "center"}}>Generate agenda</h3>
    <form onSubmit={onSubmit}>
      <tr><td>Industry</td>
        <input
          type="text"
          name="animal"
          placeholder="SaaS, E-commerce, Manufacturing..."
          value={animalInput}
          onChange={(e) => setAnimalInput(e.target.value)}
        /></tr><tr><td>Number of sales reps/AEs</td>
         <input type="text" name="benchmark1" placeholder="2,5,10..." value={benchmarkInput} onChange={(e) => setbenchmarkInput(e.target.value)}/></tr>

        <tr><td>ACV</td><input
          type="text"
          name="conversion rate"
          placeholder="$2000, $500000, ..."
          value={LCVRInput}
          onChange={(e) => setLCVRInput(e.target.value)}
        /></tr><tr><td>Sales cycle length (days)</td>
         <input type="text" name="LCVRbenchmark" placeholder="25, 30, 90, .." value={LCVRbenchmarkInput} onChange={(e) => setLCVRbenchmarkInput(e.target.value)}/></tr>
         <tr><td>Opportunity-to-win rate (%)</td>
         <input type="text" name="Win rate" placeholder="5, 10, ...." value={WCVRInput} onChange={(e) => setWCVRInput(e.target.value)}/></tr>
       <input type="submit" value="Generate results" />
    </form>
    <div className={styles.result}><p>Your result will be displayed here:<br/><br/> {result}<br/><br/><br/><br/><br/><br/>To know how we can automate this for your specific case, click here scorr.eu </p></div>

  </main>
</div>



  );
}
