import { Button } from '@interactors/html';
import HTML from './baseHTML';

export const RepeatableFieldAddButton = Button.extend('repeatable field add button')
  .selector('[data-test-repeatable-field-add-item-button]');

export const RepeatableFieldRemoveButton = Button.extend('repeatable field remove button')
  .selector('[data-test-repeatable-field-remove-item-button]');

const FieldList = HTML.extend('repeatable field list')
  .selector('[data-test-repeatable-field-list]')
  .locator((el, index) => (
    [...el.querySelectorAll('li')].map((li, i) => !!i === index)
  ));

// find by legend
export const RepeatableField = HTML.extend('repeatable field')
  .selector('fieldset[data-test-repeatable-field')
  .locator(el => el.querySelector('legend').textContent)
  .filters({
    id: (el) => el.id,
    emptyMessage: (el) => el.querySelector('[class^=emptyMessage]').textContent,
    removeButton: (el) => !!el.querySelector('[data-test-repeatable-field-remove-item-button]'),
    addButton: (el) => !!el.querySelector('[data-test-repeatable-field-add-item-button]'),
    addButtonId: (el) => el.querySelector('[data-test-repeatable-field-add-item-button]').id,
    addDisabled: {
      apply: (el) => {
        const addButton = el.querySelector('[data-test-repeatable-field-add-item-button]');
        if (addButton.disabled !== undefined) return addButton.disabled;
        return addButton.getAttribute('aria-disabled') === 'true';
      },
      default: false
    },
    removeDisabled: (el) => el.querySelector('[data-test-repeatable-field-remove-item-button]').disabled,
    itemCount: (el) => el.querySelectorAll('li').length,
    headLabels: (el) => !!el.querySelector('[data-test-repeatable-field-list-item-labels]'),
  })
  .actions({
    clickAddButton: ({ find }) => find(RepeatableFieldAddButton()).click(),
    clickRemoveButton: ({ perform }, index) => {
      return perform((el) => {
        const button = [...el.querySelectorAll('button[data-test-repeatable-field-remove-item-button]')].filter((b, i) => i === index)[0];
        return button ? button.click() : '';
      });
    },
    fillItem: (interactor, { index, fillFn }) => fillFn(interactor.find(FieldList(index)))
  });
