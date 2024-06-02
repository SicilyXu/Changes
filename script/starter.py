import tkinter as tk
from tkinter import ttk, filedialog, scrolledtext
import sys
import json
import content_loader
import threading


def load_status():
    try:
        with open('status.json', 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


class HotelDataDownloaderApp(tk.Tk):
    def __init__(self):
        super().__init__()

        # Load status
        self.status = load_status()

        # Window basic settings
        self.title("Hotel Data Downloader")
        self.geometry("600x400")

        # Folder selection
        self.folder_path = tk.StringVar(value=self.status.get("assets_path", "Default Path"))
        ttk.Button(self, text="Select Folder", command=self.select_folder).pack()
        ttk.Label(self, textvariable=self.folder_path).pack()

        # Dropdown menu
        self.combobox_value = tk.StringVar()
        self.combobox = ttk.Combobox(self, textvariable=self.combobox_value)
        self.combobox['values'] = self.status.get("hotel_ids")
        self.combobox.current(self.status.get("current_hotel_index"))  # Default selection "Option 1"
        self.combobox.bind("<<ComboboxSelected>>", self.on_combobox_select)
        self.combobox.pack()

        # Start download
        ttk.Button(self, text="start download", command=self.start_download).pack()

        # Console output area
        self.console_output = scrolledtext.ScrolledText(self, wrap=tk.WORD)
        self.console_output.pack(pady=10)

        # Redirect output to console output area
        self.original_stdout = sys.stdout
        sys.stdout = TextRedirector(self.console_output)

        # Handling the closing of the program
        self.protocol("WM_DELETE_WINDOW", self.on_closing)

    def save_status(self):
        with open('status.json', 'w') as file:
            json.dump(self.status, file, indent=4)

    def select_folder(self):
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.folder_path.set(folder_selected)
            self.status['assets_path'] = folder_selected
            print(f"Selected folder path: {folder_selected}")

    def on_combobox_select(self, event):
        print(f"Selected option: {self.combobox_value.get()}")
        self.status["current_hotel_index"] = self.combobox.current()

    def start_download(self):
        # 使用 threading.Thread 创建一个新线程
        download_thread = threading.Thread(target=self.download_data)
        download_thread.start()  # 启动线程

    def download_data(self):
        # 在新线程中执行耗时的下载操作
        content_loader.main(self.combobox['values'][self.combobox.current()], self.status.get("assets_path")+"/")

    def on_closing(self):
        self.save_status()
        self.destroy()


class TextRedirector:
    def __init__(self, text_widget):
        self.text_widget = text_widget

    def write(self, string):
        self.text_widget.insert(tk.END, string)
        self.text_widget.see(tk.END)

    def flush(self):
        pass


if __name__ == "__main__":
    app = HotelDataDownloaderApp()
    app.mainloop()
