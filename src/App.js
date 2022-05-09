import axios from 'axios';

import { useEffect, useState } from 'react';
import { Col, Container, Dropdown, Row, Table } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [selectedSymbolData, setSelectedSymbolData] = useState(null);

  useEffect(() => {
    axios.get(`https://api.binance.com/api/v3/exchangeInfo`)
      .then(async (res) => {
        await res.data.symbols.forEach((element) => {
          setSymbols(prevState => [...prevState, element.symbol]);
        });
        setLoading(false);
      })
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get(`https://api.binance.com/api/v3/depth?symbol=${selectedSymbol}`)
        .then(async (res) => {
          setSelectedSymbolData({
            "bids" : res.data.bids.slice(0, 10),
            "asks": res.data.asks.slice(0, 10)
          });
        })
    }, 100)

    return () => clearInterval(intervalId);
  }, [selectedSymbol])

  return (
    <div className="App">
      <h1>Symbol List...</h1> 
      <br />

      {
        (loading || !symbols || symbols.length === 0) ? 
          <h2>Loding Symbols. Please Wait....</h2> : 
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Choose a Symbol
            </Dropdown.Toggle>
          
            <Dropdown.Menu style={{ "maxHeight": "70vh", "overflowY": "scroll" }}>
              {
                symbols.map((symbol) => 
                  <Dropdown.Item 
                    onClick={() => setSelectedSymbol(symbol)}
                  > {symbol} </Dropdown.Item>
                  )
              }
            </Dropdown.Menu>
          </Dropdown>
      }

      {selectedSymbol && <h1>Selected symbol: <strong>{selectedSymbol}</strong></h1>}
      {selectedSymbol && <h3> Order Book Details </h3>}

      {
        selectedSymbolData ? 
        <Container>
          <Row>
            <Col sm={6}>
              <div>
                <h3>bids: </h3>
                <Table striped bordered hover style={{maxWidth: "700px", margin: "auto"}}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSymbolData["bids"].map((element, index) => 
                      <tr>
                        <td>{index + 1}</td>
                        <td>{Number(element[0]).toFixed(6)}</td> 
                        <td>{Number(element[1]).toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col sm={6}>
              <div>
                <h3>asks: </h3>
                <Table striped bordered hover style={{maxWidth: "700px", margin: "auto"}}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSymbolData["asks"].map((element, index) => 
                      <tr>
                        <td>{index + 1}</td>
                        <td>{Number(element[0]).toFixed(6)}</td> 
                        <td>{Number(element[1]).toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Container> : null
      }
    </div>
  );
}

export default App;
