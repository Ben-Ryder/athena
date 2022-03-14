import React from 'react';
import {Field, Form, Formik, FormikHelpers} from "formik";
import {Button} from "../../patterns/elements/button/button";
import {useAthena} from "../../helpers/use-athena";
import {useNavigate} from "react-router-dom";

interface EncryptionKeyFormData {
    encryptionKey: string;
}

const initialValues: EncryptionKeyFormData = {
    encryptionKey: ""
}

export function EnterEncryptionKeyPage() {
    const { setEncryptionPhrase } = useAthena();
    const navigate = useNavigate();

    const submitEncryptionKeyForm = async function(values: EncryptionKeyFormData, helpers: FormikHelpers<EncryptionKeyFormData>) {
        await setEncryptionPhrase(values.encryptionKey);
        await navigate('/');
        helpers.setSubmitting(false);
    }

    return (
        <>
            <h1>Enter Encryption Key</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={submitEncryptionKeyForm}
            >
                {({values, handleChange}) => (
                    <Form>
                        <div>
                            <label htmlFor="encryption-key">Encryption Key</label>
                            <Field
                                id="encryption-key" name="encryptionKey" type="text" placeholder="enter encryption key..."
                                value={values.encryptionKey} onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Button type="submit">Save</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}

