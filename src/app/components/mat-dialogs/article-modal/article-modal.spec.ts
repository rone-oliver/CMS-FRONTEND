import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleModal } from './article-modal';

describe('ArticleModal', () => {
  let component: ArticleModal;
  let fixture: ComponentFixture<ArticleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
