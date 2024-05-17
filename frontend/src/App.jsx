import React from "react";
import FlowChart from "./components/FlowChart";
import "./App.css";

function App() {
  return (
    <div className="h-dvh w-dvw">
      <div className="w-[350px] md:w-[650px] h-[600px] mx-auto">
        <h1 className="text-xl md:text-3xl text-center">
          Automated Email Sequencer
        </h1>
        <FlowChart />
      </div>
    </div>
  );
}

export default App;
