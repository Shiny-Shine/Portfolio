document.addEventListener('DOMContentLoaded', function () {
  var PER_PAGE = 6;

  document.querySelectorAll('.filter-list').forEach(function (list) {
    var targetId = list.getAttribute('data-filter-target');
    var target = document.getElementById(targetId);
    if (!target) return;

    var pager = document.querySelector('[data-pagination-target="' + targetId + '"]');
    var items = Array.prototype.slice.call(target.querySelectorAll('[data-tags]'));
    var buttons = Array.prototype.slice.call(list.querySelectorAll('button[data-filter]'));

    var state = {
      filter: 'all',
      page: 1
    };

    function getTags(item) {
      return (item.getAttribute('data-tags') || '')
        .split(',')
        .map(function (tag) { return tag.trim().toLowerCase(); })
        .filter(Boolean);
    }

    function matchesFilter(item) {
      if (state.filter === 'all') return true;
      return getTags(item).indexOf(state.filter) !== -1;
    }

    function createPagerButton(label, page, disabled, active) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;

      if (active) {
        button.classList.add('is-active');
        button.setAttribute('aria-current', 'page');
      }

      if (disabled) {
        button.disabled = true;
        return button;
      }

      button.addEventListener('click', function () {
        state.page = page;
        render();
      });

      return button;
    }

    function renderPager(totalPages) {
      if (!pager) return;

      pager.innerHTML = '';

      if (totalPages <= 1) {
        pager.hidden = true;
        return;
      }

      pager.hidden = false;

      pager.appendChild(
        createPagerButton('Prev', Math.max(1, state.page - 1), state.page === 1, false)
      );

      for (var page = 1; page <= totalPages; page += 1) {
        pager.appendChild(
          createPagerButton(String(page), page, false, page === state.page)
        );
      }

      pager.appendChild(
        createPagerButton('Next', Math.min(totalPages, state.page + 1), state.page === totalPages, false)
      );
    }

    function render() {
      var filteredItems = items.filter(matchesFilter);

      if (!pager) {
        items.forEach(function (item) {
          item.hidden = !matchesFilter(item);
        });
        return;
      }

      var totalPages = filteredItems.length === 0 ? 0 : Math.ceil(filteredItems.length / PER_PAGE);
      var safeTotalPages = Math.max(totalPages, 1);

      if (state.page > safeTotalPages) {
        state.page = 1;
      }

      var start = (state.page - 1) * PER_PAGE;
      var end = start + PER_PAGE;

      items.forEach(function (item) {
        item.hidden = true;
      });

      filteredItems.forEach(function (item, index) {
        item.hidden = !(index >= start && index < end);
      });

      renderPager(totalPages);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        state.filter = (button.getAttribute('data-filter') || 'all').trim().toLowerCase();
        state.page = 1;

        buttons.forEach(function (btn) {
          btn.classList.toggle('is-active', btn === button);
        });

        render();
      });
    });

    render();
  });
});
