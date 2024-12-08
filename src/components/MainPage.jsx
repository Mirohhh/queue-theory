import React from 'react';
import { useState } from 'react';
import { detModel } from './QueueCalc';

const MainPage = () => {
    const [lambda, setLambda] = useState('');
    const [mu, setMu] = useState('');
    const [servers, setServers] = useState('');
    const [capacity, setCapacity] = useState('');
    const [h3Txt, setH3Txt] = useState('');

    const onButtonClick = () => {
        setH3Txt(detModel(servers, capacity, lambda, mu));
    }

  return (
    <>
     <div id="main-container">
        <h1>Queue Theory</h1>
        <form action="" onSubmit={(e) => e.preventDefault}>
            <section id="form-inner-sec">
                <div id="label-input-div">
                    <label htmlFor="lambda">Arrival rate</label>
                    <input type="text" id="lambda" maxLength="4" onChange={(e) => setLambda(e.target.value)}></input>
                </div>

                <div id="label-input-div">
                    <label htmlFor="mu">Service rate</label>
                    <input type="text" id="mu" maxLength="4" onChange={(e) => setMu(e.target.value)}></input>
                </div>

                <div id="label-input-div">
                    <label htmlFor="servers">Servers</label>
                    <input type="text" id="servers" maxLength="2" onChange={(e) => setServers(e.target.value)}></input>
                </div>

                <div id="label-input-div">
                    <label htmlFor="bound">Capacity</label>
                    <input type="text" id="bound" maxLength="2" onChange={(e) => setCapacity(e.target.value)}></input>
                </div>
            </section>
            <div type="submit" id="sbmt" onClick={onButtonClick}> <span id="btn-txt">Calculate</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-right</title><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" /></svg> </div>
            <h3 id="result">{h3Txt}</h3>
        </form>
    </div>
    <footer>
        <h4>Copyright © Mirohhh {new Date().getFullYear()}</h4>
        <a href="https://github.com/Mirohhh"><i className="devicon-github-original"></i></a>
    </footer>
    </>
  )
}

export default MainPage;