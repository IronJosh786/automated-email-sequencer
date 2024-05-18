import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import axios from "axios";
import Modal from "react-modal";
import "reactflow/dist/style.css";
import { useState, useCallback, useEffect } from "react";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const FlowChart = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeCount, setNodeCount] = useState(1);
  const [selectedNodeType, setSelectedNodeType] = useState("Lead-Source");

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const addNode = (label, content) => {
    const newNodeId = (nodeCount + 1).toString();
    const newNode = {
      id: newNodeId,
      data: { label: `${label}\n${content}` },
      position: { x: 100, y: nodeCount * 100 },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeCount((count) => count + 1);

    const newEdge = {
      id: `${nodeCount}-${newNodeId}`,
      source: `${nodeCount}`,
      target: newNodeId,
    };
    setEdges((eds) => eds.concat(newEdge));
  };

  const handleAddNode = () => {
    if (selectedNodeType) {
      setModalContent(selectedNodeType);
      setIsOpen(true);
    } else {
      alert("Please select a valid node type.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const subject = formData.get("subject");
    const text = formData.get("content");
    const delay = formData.get("delay");
    const email = formData.get("email");
    let nodeContent = "";

    if (modalContent === "Cold-Email") {
      nodeContent = `- (${subject}) ${text}`;
    } else if (modalContent === "Wait/Delay") {
      nodeContent = `- (${delay})`;
    } else {
      nodeContent = `- (${email})`;
    }

    if (selectedNodeType === "Lead-Source") {
      setSelectedNodeType("Cold-Email");
    }
    addNode(modalContent, nodeContent);
    setIsOpen(false);
  };

  const renderModalContent = () => {
    switch (modalContent) {
      case "Cold-Email":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              name="subject"
              id="subject"
              required
              className="border border-black rounded-md p-1"
            />
            <label htmlFor="content">Content:</label>
            <input
              type="text"
              name="content"
              id="content"
              required
              className="border border-black rounded-md p-1"
            />
            <button type="submit" className="mt-2">
              Add Cold Email
            </button>
          </form>
        );
      case "Wait/Delay":
        return (
          <form onSubmit={handleSubmit}>
            <label htmlFor="delay">Delay:</label>
            <select name="delay" id="delay" required>
              {[...Array(6).keys()].map((i) => (
                <option key={i} value={`${i + 1} min`}>
                  {i + 1} min
                </option>
              ))}
            </select>
            <button type="submit">Add Delay</button>
          </form>
        );
      case "Lead-Source":
        return (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Recipient Email:</label>
            <input
              name="email"
              id="email"
              required
              className="border border-black rounded-md p-1"
            />
            <button type="submit">Add Lead Source</button>
          </form>
        );
      default:
        return null;
    }
  };

  const handleStartProcess = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/sequence/start-process`,
      {
        nodes,
        edges,
      }
    );
    if (response.status === 200) {
      alert("Process started successfully");
    } else {
      alert("Error starting process");
    }
  };

  useEffect(() => {
    handleAddNode();
  }, []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Controls />
        <Background />
      </ReactFlow>
      <div className="w-full flex items-center justify-center gap-4">
        <select
          value={selectedNodeType}
          onChange={(e) => setSelectedNodeType(e.target.value)}
        >
          <option value="Cold-Email">Cold Email</option>
          <option value="Wait/Delay">Wait/Delay</option>
        </select>
        <button onClick={handleAddNode}>Add Node</button>
        <button onClick={handleStartProcess}>Start Process</button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default FlowChart;
