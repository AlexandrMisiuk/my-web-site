import { describe, expect, it } from 'vitest';
import { renderWithUser, screen } from '@/test/render';
import type { TechnologyCategoryOption, TechnologyItem } from '@/data/types';
import { Technologies } from './Technologies';

const mockTechnologies: readonly TechnologyItem[] = [
    { id: 'typescript', name: 'TypeScript', category: 'frontend', icon: 'typescript' },
    { id: 'angular', name: 'Angular', category: 'frontend', icon: 'angular' },
    { id: 'flutter', name: 'Flutter', category: 'mobile', icon: 'flutter' },
    { id: 'dotnet', name: '.NET', category: 'backend', icon: 'dotnet' },
    { id: 'webrtc', name: 'WebRTC', category: 'realtime-apis', icon: 'webrtc' },
];

const mockCategories: readonly TechnologyCategoryOption[] = [
    { id: 'all', label: 'All' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'backend', label: 'Backend' },
    { id: 'realtime-apis', label: 'Real-Time & APIs' },
];

describe('Technologies Section', () => {
    it('renders default technologies and category tabs without crashing', () => {
        const { container } = renderWithUser(<Technologies />);
        expect(container.firstChild).toBeInTheDocument();

        // Check tabs
        expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Frontend' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Mobile' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Backend' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Real-Time & APIs' })).toBeInTheDocument();

        // Check cards
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Flutter')).toBeInTheDocument();
    });

    it('filters technology cards by category when clicking tabs', async () => {
        const { user } = renderWithUser(<Technologies technologies={mockTechnologies} categories={mockCategories} />);

        // Initially 'all' is active
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Flutter')).toBeInTheDocument();
        expect(screen.getByText('.NET')).toBeInTheDocument();
        expect(screen.getByText('WebRTC')).toBeInTheDocument();

        // Click Mobile tab
        const mobileTab = screen.getByRole('tab', { name: 'Mobile' });
        await user.click(mobileTab);

        expect(screen.getByText('Flutter')).toBeInTheDocument();
        expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
        expect(screen.queryByText('.NET')).not.toBeInTheDocument();
        expect(screen.queryByText('WebRTC')).not.toBeInTheDocument();

        // Click Backend tab
        const backendTab = screen.getByRole('tab', { name: 'Backend' });
        await user.click(backendTab);

        expect(screen.getByText('.NET')).toBeInTheDocument();
        expect(screen.queryByText('Flutter')).not.toBeInTheDocument();

        // Click All tab to restore
        const allTab = screen.getByRole('tab', { name: 'All' });
        await user.click(allTab);

        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Flutter')).toBeInTheDocument();
        expect(screen.getByText('.NET')).toBeInTheDocument();
    });

    it('supports tab switching via keyboard navigation', async () => {
        const { user } = renderWithUser(<Technologies technologies={mockTechnologies} categories={mockCategories} />);

        const mobileTab = screen.getByRole('tab', { name: 'Mobile' });
        mobileTab.focus();
        expect(mobileTab).toHaveFocus();

        await user.keyboard('{Enter}');
        expect(screen.getByText('Flutter')).toBeInTheDocument();
        expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    });

    it('renders empty category message when active category contains no technologies', async () => {
        const frontendOnlyTech: readonly TechnologyItem[] = [
            { id: 'typescript', name: 'TypeScript', category: 'frontend', icon: 'typescript' },
        ];

        const { user } = renderWithUser(<Technologies technologies={frontendOnlyTech} categories={mockCategories} />);

        const mobileTab = screen.getByRole('tab', { name: 'Mobile' });
        await user.click(mobileTab);

        expect(screen.getByText('No technologies found in this category.')).toBeInTheDocument();
    });

    it('renders accessible fallback message when technologies list is empty', () => {
        renderWithUser(<Technologies technologies={[]} />);

        expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
        expect(screen.queryByRole('list')).not.toBeInTheDocument();
        expect(screen.getByText('Technologies list will be published soon.')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
        const { container } = renderWithUser(
            <Technologies technologies={mockTechnologies} className="custom-technologies-class" />,
        );

        expect(container.firstChild).toHaveClass('custom-technologies-class');
    });

    it('applies custom className to empty state container', () => {
        const { container } = renderWithUser(
            <Technologies technologies={[]} className="custom-technologies-empty-class" />,
        );

        expect(container.firstChild).toHaveClass('custom-technologies-empty-class');
    });
});
