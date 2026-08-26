import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';

export { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

export interface RenderWithUserResult extends RenderResult {
    user: ReturnType<typeof userEvent.setup>;
}

export function renderWithUser(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderWithUserResult {
    const user = userEvent.setup();
    return {
        user,
        ...render(ui, options),
    };
}
