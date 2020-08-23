import React, { useState, useEffect, useContext } from 'react';
import { Route, Link, useParams } from 'react-router-dom';

import { apiUrl } from '../config';
import { AppContext } from './App';

import FrameworkController, { TFramework, TSection, TCapability } from '../controllers/FrameworkController';

import pageStyles from '../styles/Page.module.scss';
import styles from '../styles/FrameworksPage.module.scss';
import { use } from 'chai';




const FrameworksList = () => {
    const appContext = useContext(AppContext);
    const controller: FrameworkController = new FrameworkController(apiUrl, appContext.user);
    const [frameworks, setFrameworks] = useState([] as TFramework[]);
    
    useEffect(() => {
        controller.getFrameworks().then((f) => setFrameworks(f));
    }, []);
    
    return (
        <div className={pageStyles.bodyContent}>
            <h1>Hello Frameworks</h1>
            { frameworks.map(f => <div key={f.id} className={pageStyles.card}><Link to={`/frameworks/${f.id}`}>{ f.name }</Link></div>)}
        </div>
    );
};

const Behavior = ({ name }: { id: number, name: string, description: string }) => {
    return (
        <div className={styles.behavior}>
            <span>{name}</span>
            <button>Never / Seldom</button>
        </div>
    )
};


const Capability = ({id, name, description, fc}: { id: number, name: string, description: string, fc: FrameworkController }) => {
    const [behaviors, setBehaviors] = useState<TCapability[]>([] as TCapability[]);

    useEffect(() => {
        fc.getBehaviors(id).then(c => setBehaviors(c));
    }, []);
    
    return (
        <div className={styles.capability} key={id}>
            <div className={styles.capabilityDescription}>
                <h3>{name}</h3>
                <span>{description}</span>
            </div>
            <div className={styles.behaviors}>
                { behaviors.map((b) => <Behavior {...b} key={b.id} />)}
            </div>
        </div>
    );
};

const Section = ({id, name, description, fc}: { id: number, name: string, description: string, fc: FrameworkController }) => {
    const [caps, setCaps] = useState<TCapability[]>([] as TCapability[]);

    useEffect(() => {
        fc.getCapabilities(id).then(c => setCaps(c));
    }, []);
    
    return (
        <div className={styles.section} key={id}>
                <div className={styles.sectionTitleBar}><span>{ name }</span><span> - { description }</span></div>
                <div className={styles.sectionContent}>
                    { caps.map(c => <Capability {...c} key={c.id} fc={fc} />)}
                </div>
            </div>
    );
};

const FrameworkDetail = () => {
    const appContext = useContext(AppContext);
    const [framework, setFramework] = useState<TFramework>(null);
    const controller: FrameworkController = new FrameworkController(apiUrl, appContext.user);

    const { id } : { id: string } = useParams();

    useEffect(() => {
        controller.getFramework(parseInt(id)).then((f) => setFramework(f));
    }, [id]);

    return framework === null ? (<div></div>) : (
        <div className={pageStyles.bodyContent}>
            <h1>{ framework!.name }</h1>
            { framework.sections && framework.sections.map(s => <Section {...s} fc={controller} key={s.id} />) }
        </div>
    );
};


const FrameworksPage = () => {
    return (
        <div className={pageStyles.bodyContainer}>
            <Route path='/frameworks/:id' component={FrameworkDetail} />
            <Route exact path='/frameworks' component={FrameworksList} />
        </div>
    )
};

export default FrameworksPage;
