import TextField from '@mui/material/TextField'

import PropTypes from 'prop-types'
import { forwardRef } from 'react'

import { NumericFormat } from 'react-number-format'

import { FormHelperText } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEffect } from 'react'
import { useRef } from 'react'

const NumericFormatCustom = forwardRef(function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                })
            }}
            thousandSeparator="."
            decimalSeparator=","
            valueIsNumericString
        />
    )
})

NumericFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

const useStyles = makeStyles({
    root: {
        '& .MuiFormLabel-root': {
            background: (props) => props.background,
            padding: '0 5px',
            borderRadius: '8px',
            left: '-3px',
        },

        '& .MuiInputBase-root': {
            background: (props) => props.background,
            borderRadius: '4px',
        },
    },
})

export default function TextInput({ id = '', name = '', value = '', inputBackground, error = '', isCurrency = false, className = '', ...props }) {
    const classes = useStyles({ background: inputBackground })

    if (value === null) {
        value = ''
    }

    const textFieldRef = useRef(null)

    useEffect(() => {
        const handleWheel = (e) => e.preventDefault()
        textFieldRef.current.addEventListener('wheel', handleWheel)

        if (textFieldRef) {
            return () => {
                textFieldRef.current?.removeEventListener('wheel', handleWheel)
            }
        }
    }, [])

    return (
        <>
            <TextField
                name={name}
                error={error ? true : false}
                value={value}
                InputProps={{
                    inputComponent: isCurrency ? NumericFormatCustom : null,
                }}
                classes={{
                    root: inputBackground ? classes.root : '',
                }}
                variant="outlined"
                className={'w-full ' + className}
                ref={textFieldRef}
                {...props}
            />
            {error && (
                <FormHelperText id={`component-error-${id}`} className="!text-red-600">
                    {error}
                </FormHelperText>
            )}
        </>
    )
}
