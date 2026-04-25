import { describe, it, expect } from 'vitest';
import { LungModel, CardiacModel, RenalModel, MetabolicModel, InflammatoryModel, CrossOrganCoupling } from './index.js';

const coupling: CrossOrganCoupling = {
  gasState: null,
  lungState: null,
  cardiacState: null,
  renalState: null,
  metabolicState: null,
  inflammatoryState: null,
};

describe('OrganModels', () => {
  it('LungModel — construct and step', () => {
    const lung = new LungModel('adult-default');
    expect(lung).toBeDefined();
    lung.step(100, coupling);
    const trending = lung.computeTrending();
    expect(trending).toBeDefined();
  });

  it('CardiacModel — construct and step', () => {
    const cardiac = new CardiacModel('adult-default');
    cardiac.step(100, coupling);
    const trending = cardiac.computeTrending();
    expect(trending).toBeDefined();
  });

  it('RenalModel — construct and step', () => {
    const renal = new RenalModel('adult-default');
    renal.step(100, coupling);
    const trending = renal.computeTrending();
    expect(trending).toBeDefined();
  });

  it('MetabolicModel — construct and step', () => {
    const metabolic = new MetabolicModel('adult-default');
    metabolic.step(100, coupling);
    const trending = metabolic.computeTrending();
    expect(trending).toBeDefined();
  });

  it('InflammatoryModel — construct and step', () => {
    const inflammatory = new InflammatoryModel('adult-default');
    inflammatory.step(100, coupling);
    const trending = inflammatory.computeTrending();
    expect(trending).toBeDefined();
  });

  it('LungModel — reset to different profile', () => {
    const lung = new LungModel('adult-default');
    lung.step(100, coupling);
    lung.reset('pediatric');
    lung.step(50, coupling);
    expect(lung.computeTrending()).toBeDefined();
  });
});
