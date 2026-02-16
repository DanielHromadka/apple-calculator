import React, { useState } from 'react';
import './Calculator.css';

interface HistoryItem {
  expression: string;
  result: string;
}

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [scientific, setScientific] = useState(false);
  const [currentExpression, setCurrentExpression] = useState('');

  const addToHistory = (expr: string, res: string) => {
    setHistory([{ expression: expr, result: res }, ...history].slice(0, 20));
  };

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
      if (previousValue && operation) {
        setCurrentExpression(`${previousValue} ${operation} ${num}`);
      } else {
        setCurrentExpression(num);
      }
    } else {
      setDisplay(display + num);
      if (previousValue && operation) {
        setCurrentExpression(`${previousValue} ${operation} ${display + num}`);
      } else {
        setCurrentExpression(display + num);
      }
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      const newDisplay = display + '.';
      setDisplay(newDisplay);
      if (previousValue && operation) {
        setCurrentExpression(`${previousValue} ${operation} ${newDisplay}`);
      } else {
        setCurrentExpression(newDisplay);
      }
    }
  };

  const handleOperation = (op: string) => {
    let valueToUse = display;
    
    if (previousValue !== null && operation && display !== '0') {
      const result = calculate();
      valueToUse = result || display;
    }
    
    setPreviousValue(valueToUse);
    setOperation(op);
    setCurrentExpression(`${valueToUse} ${op} `);
    setDisplay('0');
  };

  const calculate = () => {
    if (previousValue === null || operation === null) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result: number;

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '−':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = current !== 0 ? prev / current : NaN;
        break;
      case '^':
        result = Math.pow(prev, current);
        break;
      default:
        return;
    }

    const expr = `${previousValue} ${operation} ${display}`;
    const res = isNaN(result) ? 'Error' : result.toString();
    
    addToHistory(expr, res);
    setDisplay(res);
    setCurrentExpression('');
    setPreviousValue(null);
    setOperation(null);
    
    return res;
  };

  const handleScientific = (func: string) => {
    const value = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(value * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(value * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(value * Math.PI / 180);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case '√':
        result = Math.sqrt(value);
        break;
      case 'x²':
        result = value * value;
        break;
      case 'x³':
        result = value * value * value;
        break;
      case '1/x':
        result = 1 / value;
        break;
      case 'π':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        return;
    }

    const expr = `${func}(${display})`;
    const res = result.toString();
    addToHistory(expr, res);
    setDisplay(res);
    setCurrentExpression('');
  };

  const clear = () => {
    setDisplay('0');
    setCurrentExpression('');
    setPreviousValue(null);
    setOperation(null);
  };

  const toggleSign = () => {
    const newDisplay = (parseFloat(display) * -1).toString();
    setDisplay(newDisplay);
    if (previousValue && operation) {
      setCurrentExpression(`${previousValue} ${operation} ${newDisplay}`);
    } else {
      setCurrentExpression(newDisplay);
    }
  };

  const percentage = () => {
    const newDisplay = (parseFloat(display) / 100).toString();
    setDisplay(newDisplay);
    if (previousValue && operation) {
      setCurrentExpression(`${previousValue} ${operation} ${newDisplay}`);
    } else {
      setCurrentExpression(newDisplay);
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">
          <div className="display-text">{currentExpression || display}</div>
        </div>

        <div className="button-row">
          <button className="btn btn-function" onClick={clear}>AC</button>
          <button className="btn btn-function" onClick={toggleSign}>+/−</button>
          <button className="btn btn-function" onClick={percentage}>%</button>
          <button className="btn btn-operation" onClick={() => handleOperation('÷')}>÷</button>
        </div>

        {scientific && (
          <>
            <div className="button-row">
              <button className="btn btn-scientific" onClick={() => handleScientific('sin')}>sin</button>
              <button className="btn btn-scientific" onClick={() => handleScientific('cos')}>cos</button>
              <button className="btn btn-scientific" onClick={() => handleScientific('tan')}>tan</button>
              <button className="btn btn-scientific" onClick={() => handleScientific('ln')}>ln</button>
            </div>
            <div className="button-row">
              <button className="btn btn-scientific" onClick={() => handleScientific('log')}>log</button>
              <button className="btn btn-scientific" onClick={() => handleScientific('√')}>√</button>
              <button className="btn btn-scientific" onClick={() => handleScientific('x²')}>x²</button>
              <button className="btn btn-scientific" onClick={() => handleScientific('x³')}>x³</button>
            </div>
            <div className="button-row">
              <button className="btn btn-scientific" onClick={() => handleScientific('1/x')}>1/x</button>
              <button className="btn btn-scientific" onClick={() => handleScientific('π')}>π</button>
              <button className="btn btn-scientific" onClick={() => handleScientific('e')}>e</button>
              <button className="btn btn-scientific" onClick={() => handleOperation('^')}>x^y</button>
            </div>
          </>
        )}

        <div className="button-row">
          <button className="btn" onClick={() => handleNumber('7')}>7</button>
          <button className="btn" onClick={() => handleNumber('8')}>8</button>
          <button className="btn" onClick={() => handleNumber('9')}>9</button>
          <button className="btn btn-operation" onClick={() => handleOperation('×')}>×</button>
        </div>

        <div className="button-row">
          <button className="btn" onClick={() => handleNumber('4')}>4</button>
          <button className="btn" onClick={() => handleNumber('5')}>5</button>
          <button className="btn" onClick={() => handleNumber('6')}>6</button>
          <button className="btn btn-operation" onClick={() => handleOperation('−')}>−</button>
        </div>

        <div className="button-row">
          <button className="btn" onClick={() => handleNumber('1')}>1</button>
          <button className="btn" onClick={() => handleNumber('2')}>2</button>
          <button className="btn" onClick={() => handleNumber('3')}>3</button>
          <button className="btn btn-operation" onClick={() => handleOperation('+')}>+</button>
        </div>

        <div className="button-row">
          <button className="btn btn-zero" onClick={() => handleNumber('0')}>0</button>
          <button className="btn" onClick={handleDecimal}>.</button>
          <button className="btn btn-operation" onClick={calculate}>=</button>
        </div>

        <div className="button-row toggle-row">
          <button className="btn btn-toggle" onClick={() => setScientific(!scientific)}>
            {scientific ? 'Basic' : 'Scientific'}
          </button>
          <button className="btn btn-toggle" onClick={() => setShowHistory(!showHistory)}>
            History
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="history-panel">
          <h3>History</h3>
          {history.length === 0 ? (
            <p className="no-history">No calculations yet</p>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-expression">{item.expression}</div>
                  <div className="history-result">= {item.result}</div>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-clear-history" onClick={() => setHistory([])}>
            Clear History
          </button>
        </div>
      )}
    </div>
  );
};

export default Calculator;
