'use client';

import React, { useState } from 'react';
import { CodeEditor } from '@/components/ui/CodeEditor';

// Mock test case data for testing
const SAMPLE_TEST_CASES = [
  {
    input: '5\n10',
    expectedOutput: '15',
    isHidden: false,
  },
  {
    input: '2\n3',
    expectedOutput: '5',
    isHidden: false,
  },
  {
    input: '0\n0',
    expectedOutput: '0',
    isHidden: false,
  },
];

const SAMPLE_CODE = {
  javascript: `// Add two numbers
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];
rl.on('line', (line) => {
  input.push(line);
  if (input.length === 2) {
    const a = parseInt(input[0]);
    const b = parseInt(input[1]);
    console.log(a + b);
    rl.close();
  }
});`,
  python: `# Add two numbers
a = int(input())
b = int(input())
print(a + b)`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(a + b);
        scanner.close();
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
};

export default function TestCodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof SAMPLE_CODE>('javascript');

  const handleSubmissionComplete = (submissionId: string) => {
    console.log('Submission completed:', submissionId);
    alert('Submission completed successfully!');
  };

  return (
    <div className="min-h-screen bg-oasis-dark p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Code Editor Test</h1>
          <p className="text-gray-400">Test the Judge0 integration with a simple &quot;Add Two Numbers&quot; problem</p>
          
          <div className="mt-4 p-4 bg-oasis-surface rounded-lg border border-oasis-primary/30">
            <h2 className="text-xl font-bold text-white mb-2">Problem: Add Two Numbers</h2>
            <p className="text-gray-300 mb-4">
              Given two integers, output their sum.
            </p>
            
            <div className="space-y-2">
              <div>
                <span className="text-gray-400 font-medium">Input:</span>
                <p className="text-gray-300">Two integers, one per line</p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Output:</span>
                <p className="text-gray-300">The sum of the two integers</p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Example:</span>
                <div className="bg-oasis-dark p-2 rounded mt-1">
                  <div className="text-gray-400">Input:</div>
                  <pre className="text-white">5
10</pre>
                  <div className="text-gray-400 mt-2">Output:</div>
                  <pre className="text-white">15</pre>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
            <h3 className="text-blue-400 font-bold mb-2">Quick Start Templates:</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(SAMPLE_CODE).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang as keyof typeof SAMPLE_CODE)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Load {lang.charAt(0).toUpperCase() + lang.slice(1)} Template
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <CodeEditor
          challengeId="test-challenge"
          initialCode={SAMPLE_CODE[selectedLanguage]}
          testCases={SAMPLE_TEST_CASES}
          onSubmissionComplete={handleSubmissionComplete}
        />
        
        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg">
          <h3 className="text-yellow-400 font-bold mb-2">Testing Instructions:</h3>
          <ol className="text-gray-300 space-y-1">
            <li>1. Choose a programming language from the dropdown</li>
            <li>2. Load a template or write your own code</li>
            <li>3. Click &quot;Test Code&quot; to run against the test cases</li>
            <li>4. View results in the &quot;Results&quot; tab</li>
            <li>5. Click &quot;Submit Solution&quot; to simulate final submission</li>
          </ol>
          
          <div className="mt-4 p-3 bg-gray-800 rounded">
            <p className="text-gray-400 text-sm">
              <strong>Note:</strong> The Judge0 API needs to be running at the configured endpoint 
              for testing to work. If you see connection errors, check the environment variables
              and ensure the Judge0 service is accessible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
