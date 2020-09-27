import React, { useEffect, useState, createRef } from 'react';
import { Route, Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useImmer } from 'use-immer';

import { TBehavior, TCapability, TSection } from '../controllers/FrameworkController';
import { RootState } from '../redux/Types';
import { AppDispatch, useAppDispatch } from '../redux/Store';

import {
    getFrameworks,
    getSectionsForFramework,
    getCapabilitiesForSection,
    getBehaviorsForCapability,
    addBehaviorToCapability,
    frameworkListSelector,
    frameworkDetailSelector,
    capabilitiesSelector,
    behaviorsSelector,
    addCapabilityToSection,
    addSectionToFramework,
} from '../redux/slices/FrameworksSlice';

import pageStyles from '../styles/Page.module.scss';
import styles from '../styles/FrameworksPage.module.scss';

const FrameworksList = () => {
    const [frameworks, requestStatus] = useSelector(frameworkListSelector);

    return (
        <div className={pageStyles.bodyContent}>
            <h1>Hello Frameworks</h1>
            { requestStatus === 'loading'
                ? <span>Loading...</span>
                : frameworks.map((f) => <div key={f.id} className={pageStyles.card}><Link to={`/frameworks/${f.id}`}>{ f.name }</Link></div>) }
        </div>
    );
};

const BehaviorInput = ({ capabilityId }: {capabilityId: number}) => {
    const dispatch: AppDispatch = useAppDispatch();
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
    };

    const keyPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            console.log(event.target);
            console.log('Enter!');

            const behavior: TBehavior = {
                id: -1,
                name: nameRef!.current!.value,
                level: Number(level),
                description: '',
                capabilityId,
            };

            nameRef!.current!.value = '';
            nameRef?.current?.focus();

            // TODO: dispatch an action here to add the behavior
            dispatch(addBehaviorToCapability({ capabilityId, behavior }));
        }
    };

    return (
        <div className={styles.behaviorInput}>
            <input
              className={styles.nameInput}
              ref={nameRef}
              onKeyPress={keyPressed}
            />
            <input
              className={styles.levelInput}
              size={4}
              value={level}
              onChange={levelChanged}
              onKeyPress={keyPressed}
            />
        </div>
    );
};

const Behavior = ({ name, level }: {
    name: string,
    level: number
}) => {
    return (
        <div className={styles.behavior}>
            <span>{name}</span>
            <span className={styles.level}>{level}</span>
        </div>
    );
};

const Capability = ({ id, name, description }: {
    id: number,
    name: string,
    description: string
}) => {
    const dispatch: AppDispatch = useAppDispatch();
    const [behaviors, requestStatus] = useSelector(
        (state: RootState) => behaviorsSelector(state, id),
    );

    useEffect(() => {
        dispatch(getBehaviorsForCapability(id));
    }, [id]);

    return (
        <div className={styles.capability} key={id}>
            <div className={styles.capabilityDescription}>
                <h3>{name}</h3>
                <span>{description}</span>
            </div>
            { requestStatus === 'loading'
                ? <span>Loading...</span>
                : (
                    <div className={styles.behaviors}>
                        { behaviors.map((b) => (
                            <Behavior
                              name={b.name}
                              level={b.level}
                              key={b.id}
                            />
                        ))}
                        <BehaviorInput capabilityId={id} />
                    </div>
                )}

        </div>
    );
};

interface NewCapabilityForm {
    name: string,
    description: string,
    errorMessage: string,
}

const NewCapability = ({ sectionId }: {sectionId: number}) => {
    const dispatch: AppDispatch = useAppDispatch();
    const [formVisible, setFormVisibility] = useState(false);
    const [newCapForm, updateNewCapForm]: [NewCapabilityForm, any] = useImmer({
        name: '',
        description: '',
        errorMessage: '',
    });

    const nameChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const name: string = event.currentTarget.value;
        updateNewCapForm((draft: NewCapabilityForm) => {
            draft.name = name;
        });
    };

    const descriptionChanged = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const description: string = event.currentTarget.value;
        updateNewCapForm((draft: NewCapabilityForm) => {
            draft.description = description;
        });
    };

    const addCapability = () => {
        const { name, description } = newCapForm;
        const capability: TCapability = {
            name,
            description,
            id: -1,
            sectionId,
        };

        dispatch(addCapabilityToSection({ sectionId, capability }));

        setFormVisibility(false);
        updateNewCapForm((draft: NewCapabilityForm) => {
            draft.name = '';
            draft.description = '';
        });
    };

    const cancelForm = () => {
        setFormVisibility(false);
    };

    return (
        <div className={styles.newCapability} key={9999999}>
            {
                !formVisible && <button className={styles.addCapabilityButton} type="button" onClick={() => setFormVisibility(true)}>+</button>
            }
            {
                formVisible && (
                    <div className={styles.formPanel}>
                        <div>
                            <h1>New Capability</h1>
                        </div>
                        <label className={styles.fieldRow} htmlFor="email">
                            Capability Name:
                            <input
                              id="capabilityName"
                              type="text"
                              size={17}
                              value={newCapForm.name}
                              onChange={nameChanged}
                            />
                        </label>
                        <label className={styles.fieldRow} htmlFor="password">
                            Description:
                            <textarea
                              name="categoryDescription"
                              id="categoryDescription"
                              cols={26}
                              rows={4}
                              value={newCapForm.description}
                              onChange={descriptionChanged}
                            />
                        </label>
                        <div className={styles['fieldRow-button']}>
                            <span className={styles.errorMessage}>{newCapForm.errorMessage}</span>
                            <button type="button" onClick={cancelForm}>Cancel</button>
                            <button type="button" onClick={addCapability}>Add</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

const Section = ({ id, name, description }: { id: number, name: string, description: string }) => {
    const dispatch: AppDispatch = useAppDispatch();
    const [caps, requestStatus] = useSelector(
        (state: RootState) => capabilitiesSelector(state, id),
    );

    useEffect(() => {
        dispatch(getCapabilitiesForSection(id));
    }, [id]);

    return (
        <div className={styles.section} key={id}>
            <div className={styles.sectionTitleBar}>
                <span>{ name }</span>
                <span>
                    {' '}
                    -
                    { description }
                </span>
            </div>
            {
                requestStatus === 'loading'
                    ? <span>Loading...</span>
                    : (
                        <div className={styles.sectionContent}>
                            { caps.map((c) => (
                                <Capability
                                  id={c.id}
                                  name={c.name}
                                  description={c.description}
                                  key={c.id}
                                />
                            ))}
                            <NewCapability sectionId={id} />
                        </div>
                    )
            }
        </div>
    );
};

interface NewSectionForm {
    name: string,
    description: string,
    errorMessage: string,
}

const NewSection = ({ frameworkId }: {frameworkId: number}) => {
    const dispatch: AppDispatch = useAppDispatch();
    const [formVisible, setFormVisibility]: [boolean, any] = useState(false);
    const [form, updateForm]: [NewCapabilityForm, any] = useImmer({
        name: '',
        description: '',
        errorMessage: '',
    });

    const nameChanged = (event: React.FormEvent<HTMLInputElement>) => {
        const name = event.currentTarget.value;
        updateForm((draft: NewSectionForm) => {
            draft.name = name;
        });
    };

    const descriptionChanged = (event: React.FormEvent<HTMLTextAreaElement>) => {
        const description = event.currentTarget.value;
        updateForm((draft: NewSectionForm) => {
            draft.description = description;
        });
    };

    const addSection = () => {
        const section: TSection = {
            id: -1,
            name: form.name,
            description: form.description,
            frameworkId,
        };

        dispatch(addSectionToFramework({ frameworkId, section }));

        setFormVisibility(false);

        updateForm((draft: NewSectionForm) => {
            draft.name = '';
            draft.description = '';
        });
    };

    return (
        <div className={styles.newSection}>
            <div className={styles.newSectionTitleBar} />
            <div className={styles.newSectionContent}>
                { !formVisible && (
                    <button
                      className={styles.addCapabilityButton}
                      type="button"
                      onClick={() => setFormVisibility(true)}
                    >
                        +
                    </button>
                )}
                { formVisible && (
                    <div className={styles.formPanel}>
                        <div>
                            <h1>New Section</h1>
                        </div>
                        <label className={styles.fieldRow} htmlFor="email">
                            Capability Name:
                            <input
                              id="sectionName"
                              type="text"
                              size={17}
                              value={form.name}
                              onChange={nameChanged}
                            />
                        </label>
                        <label className={styles.fieldRow} htmlFor="password">
                            Description:
                            <textarea
                              name="sectionDescription"
                              id="sectionDescription"
                              cols={26}
                              rows={4}
                              value={form.description}
                              onChange={descriptionChanged}
                            />
                        </label>
                        <div className={styles['fieldRow-button']}>
                            <span className={styles.errorMessage}>{form.errorMessage}</span>
                            <button type="button" onClick={() => setFormVisibility(false)}>Cancel</button>
                            <button type="button" onClick={addSection}>Add</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const FrameworkDetail = () => {
    const dispatch: AppDispatch = useAppDispatch();
    const { id } : { id: string } = useParams();

    const [framework, sections, requestStatus] = useSelector(
        (state: RootState) => frameworkDetailSelector(state, Number(id)),
    );

    useEffect(() => {
        dispatch(getSectionsForFramework(Number(id)));
    }, [id]);

    return framework === null ? (<div />) : (
        <div className={pageStyles.bodyContent}>
            <h1>{ framework!.name }</h1>
            { requestStatus === 'loading'
                ? <span>Loading...</span>
                : sections && sections.map((s) => (
                    <Section id={s.id} name={s.name} description={s.description} key={s.id} />
            )) }
            <NewSection frameworkId={framework!.id} />
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
            <Route path="/frameworks/:id" component={FrameworkDetail} />
            <Route exact path="/frameworks" component={FrameworksList} />
        </div>
    );
};

export default FrameworksPage;
