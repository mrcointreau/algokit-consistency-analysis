# Python Library Reference Implementation

[![PyPI version](https://badge.fury.io/py/algorandfoundation-python-library-reference-implementation.svg)](https://badge.fury.io/py/algorandfoundation-python-library-reference-implementation)
[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Python library reference implementation for the AlgoKit ecosystem.

## Overview

This is a template repository demonstrating best practices for Python library development in the Algorand ecosystem, including:

- **Trunk-based development** with beta and production releases
- **Automated CI/CD** with GitHub Actions
- **Semantic versioning** with python-semantic-release
- **Comprehensive testing** with pytest and 80% coverage threshold
- **Type checking** with mypy (strict mode)
- **Code formatting and linting** with ruff
- **Documentation** with Sphinx and Furo theme
- **Pre-commit hooks** for local quality enforcement

## Installation

```bash
pip install algorandfoundation-python-library-reference-implementation
```

Or with uv:

```bash
uv add algorandfoundation-python-library-reference-implementation
```

## Quick Start

```python
from py_lib_ref_impl import add, greet

# Add two numbers
result = add(2, 3)
print(result)  # Output: 5

# Generate a greeting
message = greet("World")
print(message)  # Output: Hello, World!
```

## Development

### Prerequisites

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/algorandfoundation/python-library-reference-implementation.git
cd python-library-reference-implementation

# Install dependencies
uv sync --all-extras --dev

# Install pre-commit hooks
uv run pre-commit install
```

### Common Commands

```bash
# Run tests
uv run pytest

# Run tests with coverage
uv run pytest --cov --cov-report=html

# Lint code
uv run ruff check src tests

# Format code
uv run ruff format src tests

# Type check
uv run mypy src

# Build documentation
uv run sphinx-build -b html docs docs/_build
```

## Release Strategy

This project uses trunk-based development:

| Branch | Release Type | Example Version |
|--------|--------------|-----------------|
| `main` | Beta pre-release | `0.1.0-beta.1` |
| `release` | Production | `0.1.0` |

### Automatic Releases

- **Push to main** triggers automatic beta release to PyPI
- **Manual workflow** promotes main to release for production releases

## License

MIT License - see LICENSE for details.

## Contributing

Contributions are welcome!
