import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';

import { Ripple } from 'primeng/ripple';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Session } from '@interfaces/store';

import { primaryColors, secondaryColors, successColors, infoColors, warningColors, dangerColors } from '@utils/color-palette';

@Component({
  selector: 'c-button',
  imports: [CommonModule, Ripple],
  templateUrl: './button.component.html',
  styles: ``
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() label: string = 'Button';
  @Input() severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' = 'primary';
  @Input() variant: 'solid' | 'outlined' | 'link' | 'text' = 'solid';
  @Input() class:any = '';
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() iconOnly: boolean = false;
  @Input() disabled: boolean = false;
  @Input() rounded: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() shadow: 'none' | 'sm' | 'md' | 'lg' = 'none';
  @Input() loading: boolean = false;

  @Output() onClick = new EventEmitter<MouseEvent>();

  private store = inject(Store);
  session$!: Observable<Session>
  darMode = signal<boolean>(false);

  constructor() {
    this.session$ = this.store.select('session');
    this.session$.subscribe((session) => {
      this.darMode.set(session.darkMode);
    });
  }

  executeCallback(event: MouseEvent) {
    if (!this.loading && !this.disabled) {
      this.onClick.emit(event);
    }
  }

  colorMap: Record<string, any> = {
    primary: primaryColors,
    secondary: secondaryColors,
    success: successColors,
    info: infoColors,
    warning: warningColors,
    danger: dangerColors,
  };

  getBg = computed<string>(() => {
    switch (this.variant) {
      case 'solid':
        return this.darMode() ? '400' : '500';
      default:
        return '500';
    }
  });

  getHoverBg = computed<string>(() => {
    switch (this.variant) {
      case 'solid':
        return this.darMode() ? '300' : '600';
      case 'outlined':
        return this.darMode() ? '950' : '100';
      case 'text':
        return this.darMode() ? '950' : '100';
      default:
        return '500';
    }
  });

  getActiveBg = computed<string>(() => {
    switch (this.variant) {
      case 'solid':
        return this.darMode() ? '200' : '700';
      case 'outlined':
        return this.darMode() ? '900' : '200';
      case 'text':
        return this.darMode() ? '800' : '300';
      default:
        return '500';
    }
  });

  getBorder = computed<string>(() => {
    switch (this.variant) {
      case 'outlined':
        return '500';
      default:
        return '500';
    }
  });

  getText = computed<string>(() => {
    switch (this.variant) {
      case 'outlined':
      case 'text':
        return '500';
      case 'link':
        return this.darMode() ? '400' : '500';
      default:
        return '500';
    }
  });

  getHoverText = computed<string>(() => {
    return this.darMode() ? '500' : '500';
  });

  getActiveText = computed<string>(() => {
    switch (this.variant) {
      case 'outlined':
        return this.darMode() ? '300' : '700';
      case 'link':
        return this.darMode() ? '200' : '700';
      default:
        return '500';
    }
  });

  getActiveBorder = computed<string>(() => {
    switch (this.variant) {
      case 'outlined':
        return this.darMode() ? '300' : '700';
      default:
        return '500';
    }
  });

  buttonColors = computed(() => {
    const colorPalette = this.colorMap[this.severity] || primaryColors;
    return {
      bg: colorPalette[this.getBg()],
      hoverBg: colorPalette[this.getHoverBg()],
      activeBg: colorPalette[this.getActiveBg()],
      border: colorPalette[this.getBorder()],
      text:
        this.variant === 'solid'
          ? this.darMode()
            ? 'black'
            : 'white'
          : colorPalette[this.getText()],
      hoverText: colorPalette[this.getHoverText()],
      activeText: colorPalette[this.getActiveText()],
      activeBorder: colorPalette[this.getActiveBorder()],
    };
  });

  buttonStyle = computed<string>(() => {
    return `
    --bg-color: ${this.buttonColors().bg};
    --hover-bg-color: ${this.buttonColors().hoverBg};
    --active-bg-color: ${this.buttonColors().activeBg};
    --border-color: ${this.buttonColors().border};
    --text-color: ${this.buttonColors().text};
    --hover-text-color: ${this.buttonColors().hoverText};
    --active-text-color: ${this.buttonColors().activeText};
    --active-border-color: ${this.buttonColors().activeBorder};
  `;
  });

  variantClasses = computed<string>(() => {
    switch (this.variant) {
      case 'solid':
        return `bg-[var(--bg-color)] text-[var(--text-color)] hover:bg-[var(--hover-bg-color)] active:bg-[var(--active-bg-color)]`;
      case 'outlined':
        return `border border-[var(--border-color)] text-[var(--text-color)] hover:bg-[var(--hover-bg-color)] active:bg-[var(--active-bg-color)] active:text-[var(--active-text-color)] active:border-[var(--active-border-color)]`;
      case 'link':
        return `text-[var(--text-color)] active:text-[var(--active-text-color)]`;
      case 'text':
        return `text-[var(--text-color)] hover:bg-[var(--hover-bg-color)] active:bg-[var(--active-bg-color)]`;
      default:
        return '';
    }
  });

  iconClasses = computed<string>(() => {
    return this.iconOnly ? 'flex items-center' : this.icon && this.iconPosition === 'left' ? 'flex items-center flex-row-reverse' : 'flex items-center';
  });

}
