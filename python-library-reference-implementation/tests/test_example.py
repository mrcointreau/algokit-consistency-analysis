"""Tests for example module."""

from py_lib_ref_impl import __version__, add, greet


class TestAdd:
    """Tests for the add function."""

    def test_add_positive_numbers(self) -> None:
        """Test adding two positive numbers."""
        assert add(2, 3) == 5

    def test_add_negative_numbers(self) -> None:
        """Test adding two negative numbers."""
        assert add(-2, -3) == -5

    def test_add_mixed_numbers(self) -> None:
        """Test adding positive and negative numbers."""
        assert add(-2, 3) == 1

    def test_add_zeros(self) -> None:
        """Test adding zeros."""
        assert add(0, 0) == 0


class TestGreet:
    """Tests for the greet function."""

    def test_greet_world(self) -> None:
        """Test greeting World."""
        assert greet("World") == "Hello, World!"

    def test_greet_name(self) -> None:
        """Test greeting a specific name."""
        assert greet("Alice") == "Hello, Alice!"

    def test_greet_empty_string(self) -> None:
        """Test greeting with empty string."""
        assert greet("") == "Hello, !"


class TestVersion:
    """Tests for version."""

    def test_version_exists(self) -> None:
        """Test that version is defined."""
        assert __version__ is not None

    def test_version_format(self) -> None:
        """Test that version follows semver format."""
        parts = __version__.split(".")
        assert len(parts) >= 2
        # First two parts should be numeric
        assert parts[0].isdigit()
        assert parts[1].isdigit()
