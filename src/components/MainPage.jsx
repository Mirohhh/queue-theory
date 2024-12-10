import React from 'react';
import { useState } from 'react';
import { detModel } from './QueueCalc';
import QueueStatisticsTable from './QueueStatisticsTable';

/**
 * MainPage is a React component that renders a form for inputting queue theory parameters
 * such as arrival rate, service rate, number of servers, and system capacity. Upon form submission,
 * it calculates and displays queue statistics using the detModel function and toggles the 
 * visibility of the QueueStatisticsTable component to show detailed simulation results.
 *
 * @returns {JSX.Element} - A JSX element containing the input form, calculation result, and 
 *                          optionally the queue statistics table.
 */
const MainPage = () => {
    const [lambda, setLambda] = useState('');
    const [mu, setMu] = useState('');
    const [servers, setServers] = useState('');
    const [capacity, setCapacity] = useState('');
    const [h3Txt, setH3Txt] = useState('');
    const [showTable, setShowTable] = useState(false);

    const onButtonClick = () => {
        setH3Txt(detModel(servers, capacity, lambda, mu));
        setShowTable(true);
    }

  return (
    <>
     <div id="main-container">
        <h1>Queue Theory</h1>
        <form action="" onSubmit={(e) => e.preventDefault}>
            <section id="form-inner-sec">
                <div id="label-input-div">
                    <label htmlFor="lambda">Arrival rate</label>
                    <input type="text" id="lambda" className='init-input' maxLength="4" onChange={(e) => setLambda(e.target.value)}></input>
                </div>

                <div id="label-input-div">
                    <label htmlFor="mu">Service rate</label>
                    <input type="text" id="mu" className='init-input' maxLength="4" onChange={(e) => setMu(e.target.value)}></input>
                </div>

                <div id="label-input-div">
                    <label htmlFor="servers">Servers</label>
                    <input type="text" id="servers" className='init-input' maxLength="2" onChange={(e) => setServers(e.target.value)}></input>
                </div>

                <div id="label-input-div">
                    <label htmlFor="bound">Capacity</label>
                    <input type="text" id="bound" className='init-input' maxLength="2" onChange={(e) => setCapacity(e.target.value)}></input>
                </div>
            </section>
            <div type="submit" id="sbmt" onClick={onButtonClick}> <span id="btn-txt">Calculate</span> <svg id='arrow' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-right</title><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" /></svg> </div>
            <p id="result">{h3Txt}</p>
            
        </form>
        {showTable && <QueueStatisticsTable lam={lambda} mu={mu} it={100}></QueueStatisticsTable>}

    </div>
    <footer>
        <h4>Copyright © Mirohhh {new Date().getFullYear()}</h4>
        <a href="https://github.com/Mirohhh"><i className="devicon-github-original"></i></a>
    </footer>
    </>
  )
}

export default MainPage;