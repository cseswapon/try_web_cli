"use client";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export default function TerminalComponent() {
  const terminalRef = useRef(null);
  const [fileSystem, setFileSystem] = useState([
    "file1.txt",
    "file2.txt",
    "Documents",
    "Pictures",
  ]);

  useEffect(() => {
    if (terminalRef.current) {
      const term = new Terminal({ cursorBlink: true });
      term.open(terminalRef.current);

      const prompt = () => {
        term.write("\r\n$ ");
      };

      term.writeln("Welcome to Web Terminal! Type 'help' for commands.");
      prompt();

      let commandBuffer = "";
      term.onData((data) => {
        if (data === "\r") {
          term.writeln("");
          executeCommand(commandBuffer, term);
          commandBuffer = "";
          prompt();
        } else if (data === "\u007f") {
          if (commandBuffer.length > 0) {
            commandBuffer = commandBuffer.slice(0, -1);
            term.write("\b \b");
          }
        } else {
          commandBuffer += data;
          term.write(data);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const executeCommand = async (command: string, term: Terminal) => {
    const args = command.trim().split(" ");
    const cmd = args[0];

    switch (cmd) {
      case "ls":
        term.writeln(fileSystem.join("  "));
        break;

      case "mkdir":
        if (args[1]) {
          setFileSystem((prev) => [...prev, args[1]]);
          term.writeln(`Folder '${args[1]}' created.`);
        } else {
          term.writeln("mkdir: missing operand");
        }
        break;

      case "touch":
        if (args[1]) {
          setFileSystem((prev) => [...prev, args[1]]);
          term.writeln(`File '${args[1]}' created.`);
        } else {
          term.writeln("touch: missing file name");
        }
        break;

      case "echo":
        if (args.length > 1) {
          term.writeln(args.slice(1).join(" "));
        } else {
          term.writeln("");
        }
        break;

      case "date":
        term.writeln(new Date().toString());
        break;

      case "fetch":
        try {
          term.writeln("Fetching API data...");
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
          );
          if (!response.ok) {
            term.writeln(`Error: ${response.statusText}`);
          } else {
            const data = await response.json();
            term.writeln(JSON.stringify(data, null, 2));
          }
        } catch (error) {
          term.writeln("Error fetching data.");
          console.error("Fetch error: ", error);
        }
        break;
      case "clear":
        term.clear();
        break;

      case "help":
        term.writeln(
          "Available commands: ls, mkdir <name>, touch <filename>, echo <text>, date, fetch, clear, help"
        );
        break;

      default:
        term.writeln(`Command not found: ${cmd}`);
    }
  };

  return (
    <div
      ref={terminalRef}
      className="h-fit w-full border bg-black text-white p-2"
    />
  );
}
