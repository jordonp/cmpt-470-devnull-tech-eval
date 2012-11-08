class HomeController < ApplicationController
  before_filter :sign_in_required

  def index
    respond_to do |format|
        format.html 
    end
  end
end
