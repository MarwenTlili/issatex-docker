import React from 'react'
import {
    BooleanInput,
    ImageField,
    ImageInput,
    PasswordInput,
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
    useCreate,
    useCreateSuggestionContext,
} from 'react-admin'
import {
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material'
import { equalToPlainPassword } from '../user/Create'
import { User } from '../../../types/User'

interface UserCreateDialogProps {
    resource: string
}

const UserCreateToolbar = () => {
    return (
        <Toolbar>
            <SaveButton
                label='Create'
                type='button'
                variant='text'
            />
        </Toolbar>
    )
}

const UserCreateDialog = (props: UserCreateDialogProps) => {
    const { resource } = props

    const { filter, onCancel, onCreate } = useCreateSuggestionContext()
    const [create] = useCreate()
    const [value, setValue] = React.useState(filter || '')

    const handleSubmit = (values: User) => {
        console.log(values)

        const { confirmPassword, ...newUser } = values

        create(
            resource,
            { data: newUser },
            {
                onSuccess: (data) => {
                    console.log(data)

                    setValue('')
                    onCreate(data)
                },
            }
        )
    }

    return (
        <Dialog
            fullWidth
            open
            onClose={onCancel}
            aria-label='Create User'
        >
            <DialogTitle>Create User</DialogTitle>
            <DialogContent>
                <SimpleForm
                    resource='account'
                    onSubmit={handleSubmit}
                    toolbar={<UserCreateToolbar />}
                >
                    <ImageInput source='avatar'
                        label='Avatar'
                        accept='image/*'
                        maxSize={1000000}
                    >
                        <ImageField source='contentUrl' title='title' />
                    </ImageInput>
                    <TextInput source='email' required={true} />
                    <TextInput source='username' required={true} />
                    <PasswordInput source='plainPassword' required={true} />
                    <PasswordInput source='confirmPassword'
                        validate={equalToPlainPassword} />
                    <BooleanInput source='isVerified' />
                </SimpleForm>
            </DialogContent>
        </Dialog>
    )
}

export default UserCreateDialog
