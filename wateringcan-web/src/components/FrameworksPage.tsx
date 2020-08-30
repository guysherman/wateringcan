import React, { useEffect, useState, createRef } from 'react';
import { Route, Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


import { AppDispatch, useAppDispatch } from '../redux/Store';

import {
    getFrameworks,
    getSectionsForFramework,
    getCapabilitiesForSection,
    getBehaviorsForCapability,
    frameworkListSelector,
    frameworkDetailSelector,
    capabilitiesSelector,
    behaviorsSelector,
} from '../redux/slices/FrameworksSlice';

import pageStyles from '../styles/Page.module.scss';
import styles from '../styles/FrameworksPage.module.scss';
import { RootState } from 'redux/Types';

const FrameworksList = () => {
    const [frameworks, requestStatus] = useSelector(frameworkListSelector);

    return (
        <div className={pageStyles.bodyContent}>
            <h1>Hello Frameworks</h1>
            { requestStatus === 'loading' ?
                <span>Loading...</span> :
                frameworks.map(f => <div key={f.id} className={pageStyles.card}><Link to={`/frameworks/${f.id}`}>{ f.name }</Link></div>)
            }
        </div>
    );
};

const BehaviorInput = () => {
    const [level, setLevel] = useState('1');
    const nameRef = createRef<HTMLInputElement>();

    const levelChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const inputText: string = event.currentTarget.value;
        if (inputText === '') {
            setLevel(inputText);
            return;
        }

        const newLevel = Number(inputText) || level;
        setLevel(newLevel.toString());
    }

    const keyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            console.log(event.target);
            console.log('Enter!');

            // TODO: dispatch an action here to add the behavior

            nameRef!.current!.value = '';
            nameRef?.current?.focus();
        }
    }
    
    return (
        <div className={styles.behaviorInput}>
            <input className={styles.nameInput}
                ref={nameRef}
                onKeyPress={keyPressed} />
            <input className={styles.levelInput}
                size={4}
                value={level}
                onChange={levelChanged}
                onKeyPress={keyPressed}/>
        </div>
    );
};

const Behavior = ({ name, level }: { id: number, name: string, description: string, level: number }) => {
    return (
        <div className={styles.behavior}>
            <span>{name}</span>
            <span className={styles.level}>{level}</span>
        </div>
    )
};


const Capability = ({id, name, description }: { id: number, name: string, description: string }) => {
    const dispatch: AppDispatch = useAppDispatch();
    const [behaviors, requestStatus] = useSelector(
        (state: RootState) => behaviorsSelector(state, id)
    );

    useEffect(() => {
        dispatch(getBehaviorsForCapability(id));
    }, [id])
    
    return (
        <div className={styles.capability} key={id}>
            <div className={styles.capabilityDescription}>
                <h3>{name}</h3>
                <span>{description}</span>
            </div>
            { requestStatus === 'loading' ? 
                <span>Loading...</span> :
                <div className={styles.behaviors}>
                    { behaviors.map((b) => <Behavior {...b} key={b.id} />)}
                    <BehaviorInput />
                </div>
            }
            
        </div>
    );
};

const Section = ({id, name, description}: { id: number, name: string, description: string }) => {
    const dispatch: AppDispatch = useAppDispatch();
    const [caps, requestStatus] = useSelector(
        (state: RootState) => capabilitiesSelector(state, id)
    );

    useEffect(() => {
        dispatch(getCapabilitiesForSection(id));
    }, [id])

    return (
        <div className={styles.section} key={id}>
                <div className={styles.sectionTitleBar}><span>{ name }</span><span> - { description }</span></div>
                {
                        requestStatus === 'loading' ?
                    <span>Loading...</span> :
                    <div className={styles.sectionContent}>
                        { caps.map(c => <Capability {...c} key={c.id}  />)}
                    </div>
                }
            </div>
    );
};

const FrameworkDetail = () => {
    const dispatch: AppDispatch = useAppDispatch();
    const { id } : { id: string } = useParams();

    const [framework, sections, requestStatus] = useSelector(
        (state: RootState) => frameworkDetailSelector(state, Number(id))
    );


    useEffect(() => {
        dispatch(getSectionsForFramework(Number(id)));
    }, [id]);

    return framework === null ? (<div></div>) : (
        <div className={pageStyles.bodyContent}>
            <h1>{ framework!.name }</h1>
            { requestStatus === 'loading' ?
            <span>Loading...</span>
            : sections && sections.map(s => <Section {...s} key={s.id} />) }
        </div>
    );
};


const FrameworksPage = () => {
    const dispatch: AppDispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(getFrameworks());
    }, []);
    
    return (
        <div className={pageStyles.bodyContainer}>
            <Route path='/frameworks/:id' component={FrameworkDetail} />
            <Route exact path='/frameworks' component={FrameworksList} />
        </div>
    )
};

export default FrameworksPage;
