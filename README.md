### Key Components

- **URLImport**: Processes data passed via URL from the browser extension
- **FileUpload**: Handles direct JSON file uploads
- **FilterPanel**: Manages all filtering options
- **WorksTable**: Displays the reading history with sorting and pagination
- **StatisticsPanel**: Shows summary statistics and analysis
- **ChartPanel**: Displays various visualizations of the data
- **ExportButtons**: Provides export functionality in different formats

### Data Flow

1. Data is imported via URL parameter or file upload
2. The DataContext manages the application state
3. Filtering and sorting are applied in memory
4. Components render views of the filtered/sorted data
5. Export functions format and download the data in the chosen format

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Keep privacy in mind - all data processing should happen client-side
- Maintain performance with large datasets (some users have 6000+ works)
- Follow the existing code style and patterns
- Add tests for new functionality
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Archive of Our Own (AO3)](https://archiveofourown.org/) for providing the reading history functionality
- All contributors to the open-source libraries used in this project
- The AO3 user community for inspiration and feedback

---

_Note: AO3 History Explorer is not affiliated with or endorsed by Archive of Our Own or the Organization for Transformative Works._
