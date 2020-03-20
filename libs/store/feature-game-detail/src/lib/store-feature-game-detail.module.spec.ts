import { async, TestBed } from '@angular/core/testing';
import { StoreFeatureGameDetailModule } from './store-feature-game-detail.module';

describe('StoreFeatureGameDetailModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreFeatureGameDetailModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(StoreFeatureGameDetailModule).toBeDefined();
  });
});
