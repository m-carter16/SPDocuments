import * as React from 'react';

export const useForceUpdate = () => {
    const [, setState] = React.useState(true)
    const forceUpdate = React.useCallback(() => {
        setState(s => !s)
    }, [])

    return forceUpdate
};
