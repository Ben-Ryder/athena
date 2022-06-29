import React from 'react';
import {useNavigate} from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import {Input, Button} from "@ben-ryder/jigsaw";

import {useAthena} from "../../helpers/use-athena";

import {FormPage} from "../../patterns/layout/form-page";


interface LoginFormData {
  username: string;
  password: string;
  encryptionKey: string;
}


export function LoginPage() {
  const { apiClient, setEncryptionKey } = useAthena();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>();


  const onSubmit: SubmitHandler<LoginFormData> = async function(values: LoginFormData) {
    try {
      await apiClient.login(values.username, values.password);
      await setEncryptionKey(values.encryptionKey);
    }
    catch (e: any) {
      alert("login failed");
      console.log(e);
      return;
    }

    await navigate('/');
  };

  return (
    <FormPage title="Log In">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            name="username"
            defaultValue=""
            control={control}
            render={({ field }) => <Input {...field} id="username" label="Username" type="text"/>}
          />
        </div>
        <div>
          <Controller
            name="password"
            defaultValue=""
            control={control}
            render={({ field }) => <Input {...field} id="password" label="Password" type="password" />}
          />
        </div>
        <div>
          <Controller
            name="encryptionKey"
            defaultValue=""
            control={control}
            render={({ field }) => <Input {...field} id="encryptionKey" label="Encryption Key" type="text" />}
          />
          <p>Your encryption key is never sent to the server.</p>
        </div>
        <div>
          <Button type="submit">Log In</Button>
        </div>
      </form>
    </FormPage>
  );
}

