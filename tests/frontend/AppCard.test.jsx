import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AppCard from '../../frontend/src/components/AppCard/AppCard.jsx';

const mockApp = {
  id: 1,
  name: 'Netflix',
  icon: 'https://example.com/netflix.png',
  url: 'https://netflix.com',
  is_external: true,
};

const mockAppNoIcon = { id: 2, name: 'YouTube', icon: null, url: 'https://youtube.com', is_external: true };

describe('AppCard', () => {
  it('renders the app name', () => {
    render(<AppCard app={mockApp} onOpen={() => {}} />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
  });

  it('shows initial letter when no icon', () => {
    render(<AppCard app={mockAppNoIcon} onOpen={() => {}} />);
    expect(screen.getByText('Y')).toBeInTheDocument();
  });

  it('shows initial letter when icon fails to load', () => {
    render(<AppCard app={mockApp} onOpen={() => {}} />);
    const img = screen.getByAltText('Netflix');
    fireEvent.error(img);
    expect(screen.getByText('N')).toBeInTheDocument();
  });

  it('calls onOpen when card is clicked', () => {
    const onOpen = vi.fn();
    render(<AppCard app={mockApp} onOpen={onOpen} />);
    fireEvent.click(screen.getByTitle('Netflix'));
    expect(onOpen).toHaveBeenCalledWith(mockApp);
  });

  it('does not render favorite button when onToggleFavorite is not provided', () => {
    render(<AppCard app={mockApp} onOpen={() => {}} />);
    expect(screen.queryByLabelText('Ajouter aux favoris')).toBeNull();
  });

  it('renders favorite button when onToggleFavorite is provided', () => {
    render(<AppCard app={mockApp} onOpen={() => {}} isFavorite={false} onToggleFavorite={() => {}} />);
    expect(screen.getByLabelText('Ajouter aux favoris')).toBeInTheDocument();
  });

  it('shows active favorite state', () => {
    render(<AppCard app={mockApp} onOpen={() => {}} isFavorite={true} onToggleFavorite={() => {}} />);
    expect(screen.getByLabelText('Retirer des favoris')).toBeInTheDocument();
    expect(screen.getByText('♥')).toBeInTheDocument();
  });

  it('calls onToggleFavorite with app id when favorite button is clicked', () => {
    const onToggle = vi.fn();
    render(<AppCard app={mockApp} onOpen={() => {}} isFavorite={false} onToggleFavorite={onToggle} />);
    fireEvent.click(screen.getByLabelText('Ajouter aux favoris'));
    expect(onToggle).toHaveBeenCalledWith(1);
  });

  it('has loading="lazy" on the icon img', () => {
    render(<AppCard app={mockApp} onOpen={() => {}} />);
    const img = screen.getByAltText('Netflix');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
