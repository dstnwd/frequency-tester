import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { GithubPicker } from 'react-color';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import {useCallback, useEffect, useRef, useState} from "react";
import {Button} from "react-bootstrap";

const NUMBER_OF_ROWS = 30;
const NUMBER_OF_COLUMNS = 120;

function App() {
    const [rows, setRows] = useState([]);
    const [stats, setStats] = useState([]);
    const [frequency, setFrequency] = useState(100);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [fillingColor, setFillingColor] = useState('#B80000');
    const [minimum, setMinimum] = useState(1);
    const [maximum, setMaximum] = useState(NUMBER_OF_ROWS);

    const initialize = useCallback(() => {
        const newRows = [...Array(NUMBER_OF_ROWS).keys()].map((row) => ({
            id: `Row_${row + 1}`,
            columns: [...Array(NUMBER_OF_COLUMNS).keys()].map((column) => ({
                isPainted: false,
                id: `${row}_${column}`,
            })),
        }));

        setRows(newRows);

        const newStats = [...Array(NUMBER_OF_COLUMNS).keys()].map(() =>{
            return 0;
        });
        setStats([...newStats]);
    }, []);

    const generateNewRandomNumber = () => {
        const randomNumber = Math.floor(Math.random() * (maximum - minimum) + minimum);

        const copyOfStats = [...stats];

        stats.forEach((stat, index) => {
            if (index !== 0) {
                copyOfStats[index - 1] = copyOfStats[index];
            }

            if (index === (stats.length - 1)) {
                copyOfStats[index] = randomNumber;
            }
        });

        setStats(() => [...copyOfStats]);
    };

    const getCellColor = useCallback((rowIndex, columnIndex) => {
        if (stats[columnIndex] === 0 || (rowIndex + 1) < stats[columnIndex]) return 'white';
        return fillingColor;
    }, [stats]);

    const getColorPicker = () => (showColorPicker && <GithubPicker color={fillingColor} onChangeComplete={(color) => {
        setFillingColor(color.hex);
        setShowColorPicker(false);
    }} />);

    const colorPickerButtonClickHandler = useCallback((ev) => {
        ev.preventDefault();
        setShowColorPicker(!showColorPicker);
    }, [setShowColorPicker, showColorPicker]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            generateNewRandomNumber();
        }, frequency);

        return () => clearTimeout(timeoutId);
    }, [stats, frequency]);

  return (
      <Container>
          <Row>
              <Col>
                  <div className="mt-4 main-container">
                      {
                          rows.map((row, rowIndex) => {
                              return (
                                  <Row key={row.id} className="row-cell">
                                      {
                                          row.columns.map((column, columnIndex) => (<Col key={column.id} className="h-100 px-0">
                                              <div className={`h-100`} style={{
                                                  backgroundColor: getCellColor(rowIndex, columnIndex)
                                              }}></div>
                                          </Col>))
                                      }
                                  </Row>
                              )
                          })
                      }
                  </div>
              </Col>
          </Row>

          <Row className="pt-4 px-4">
              <Col>
                  <Form.Label>Frequency: {frequency}</Form.Label>
                  <Form.Range
                      value={frequency}
                      onChange={(ev) => setFrequency(ev.target.value)}
                  />
              </Col>

              <Col xs={'auto'}>
                  <Button onClick={colorPickerButtonClickHandler}>Choose a different color</Button>

                  {getColorPicker()}
              </Col>
          </Row>

          <Row className="pt-4 px-4">
              <Col>
                  <Form.Label htmlFor="minimumVal">Minimum value</Form.Label>
                  <Form.Control
                      type="number"
                      id="minimumVal"
                      value={minimum}
                      onChange={(ev) => setMinimum(ev.target.value)}
                  />
              </Col>

              <Col>
                  <Form.Label htmlFor="maximumVal">Maximum value</Form.Label>
                  <Form.Control
                      type="number"
                      id="maximumVal"
                      value={maximum}
                      onChange={(ev) => setMaximum(ev.target.value)}
                  />
              </Col>
          </Row>
      </Container>
  );
}

export default App;
